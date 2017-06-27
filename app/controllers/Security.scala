package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api._
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.api.util.{Clock, Credentials, PasswordHasher}
import com.mohiva.play.silhouette.impl.authenticators.BearerTokenAuthenticator
import com.mohiva.play.silhouette.impl.providers.CredentialsProvider
import error.ErrorIO._
import error.{Errors, SecurityError}
import play.api.Configuration
import play.api.i18n.MessagesApi
import play.api.libs.json.Json
import play.api.mvc._
import utils.Implicits._
import security.{MailTokenService, MailTokenUser, QuillEnv}
import utils.{Actions, Mailer}
import v1.UserIO._
import v1.project.ProjectService
import v1.user._
import utils.Implicits._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class Security @Inject()(
  val messagesApi: MessagesApi,
  val projectService: ProjectService,
  val userService: UserService,
  val silhouette: Silhouette[QuillEnv],
  val passwordHasher: PasswordHasher,
  val authInfoRepository: AuthInfoRepository,
  val credentialsProvider: CredentialsProvider,
  val configuration: Configuration,
  val mailTokenService: MailTokenService[MailTokenUser],
  val mailer: Mailer,
  val clock: Clock
) extends Controller {

    val userExistsError = Errors(List(SecurityError("signup.email", "validation.email.exists").translate(messagesApi)))
    val userNotFoundError = Errors(List(SecurityError("signin.failed", "signin.error.notfound").translate(messagesApi)))
    val emailNotFoundError = Errors(List(SecurityError("new-password.failed", "signin.error.notfound").translate(messagesApi)))
    val authenticatorExpiry = 30 days
    val authenticatorIdleTimeout = 5 days
    val authService = silhouette.env.authenticatorService
    val eventBus = silhouette.env.eventBus

    def signIn = Actions.json[PostedCredentials](Some("signin")) { (pc, r) =>
        val credentials = Credentials(pc.identifier, pc.password)
        implicit val request = r
        credentialsProvider.authenticate(credentials).flatMap { loginInfo =>
            userService.retrieve(loginInfo).flatMap {
                case Some(user) =>
                    for {
                        authenticator <- authService.create(loginInfo)
                        _ = eventBus.publish(LoginEvent(user, r))
                        token <- authService.init(updatedAuthenticator(authenticator))
                    } yield {
                        Ok(Json.obj("token" -> token))
                    }
                case _ =>
                    Unauthorized(Json.toJson(userNotFoundError))
            }
        }
    }

    def signOut = silhouette.SecuredAction.async { implicit request =>
        eventBus.publish(LogoutEvent(request.identity, request))
        authService.discard(request.authenticator, Ok)
    }

    def signUp = Actions.json[SignUp](Some("signup")) { (data, r) =>
        implicit val request = r
        val loginInfo = LoginInfo(CredentialsProvider.ID, data.email)
        userService.retrieve(loginInfo).flatMap {
            case Some(user) =>
                BadRequest(Json.toJson(userExistsError))
            case None =>
                val authInfo = passwordHasher.hash(data.password)
                for {
                    Some(user: User) <- userService.createUser(data.copy(password = authInfo))
                    authInfo <- authInfoRepository.add(loginInfo, authInfo)
                    authenticator <- authService.create(loginInfo)
                    token <- authService.init(authenticator)
                } yield {
                    eventBus.publish(SignUpEvent(user, request))
                    eventBus.publish(LoginEvent(user, request))
                    Ok(Json.obj("token" -> token))
                }
        }
    }

    def accountInfo = silhouette.SecuredAction.async { implicit request =>
        val user: User = request.identity
        if (user.lastProject.isEmpty) {
            for {
                project <- projectService.getProject(user)
            } yield {
                Ok(Json.toJson(user.copy(lastProject = Some(project.id))))
            }
        } else {
            Ok(Json.toJson(user))
        }
    }

    def requestPasswordChange = Actions.json[RequestPasswordChange](Some("forgot-password")) { (rpc, r) =>
        val token = MailTokenUser(rpc.identifier)
        implicit val request = r
        (for {
            Some(user) <- userService.retrieve(rpc.identifier)
            Some(token) <- mailTokenService.create(token)
        } yield {
            mailer.forgotPassword(user.email, link = routes.Security.changePasswordPage(token.id).absoluteURL())
            Ok
        })
        .fallbackTo {
            Unauthorized(Json.toJson(userNotFoundError))
        }
    }

    def changePasswordPage(id: String) = Action.async { implicit request =>
        (for {
            Some(token) <- mailTokenService.retrieve(id)
        } yield {
            if (token.isExpired) {
                mailTokenService.consume(id)
                Redirect("/404")
            } else {
                Ok(views.html.index())
            }
        })
        .fallbackTo(Redirect("/404"))
    }

    def changePassword = Actions.json[PasswordChange](Some("new-password")) { (pc, r) =>
        implicit val request = r
        (for {
            Some(token: MailTokenUser) <- mailTokenService.retrieve(pc.id) if !token.isExpired
            Some(user) <- userService.retrieve(token.email)
            _ <- authInfoRepository.update(token.email, passwordHasher.hash(pc.password))
            authenticator <- authService.create(user.email)
            result <- authService.renew(authenticator, Ok)
        } yield {
            mailTokenService.consume(pc.id)
            result
        })
        .fallbackTo(Unauthorized)
    }

    private def updatedAuthenticator(a: BearerTokenAuthenticator) = a.copy(
        expirationDateTime = clock.now.plus(authenticatorExpiry.toMillis),
        idleTimeout = None
    )

}
