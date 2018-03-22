package controllers

import com.mohiva.play.silhouette.api._
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.api.services.AuthenticatorService
import com.mohiva.play.silhouette.api.util.{Clock, Credentials, PasswordHasher}
import com.mohiva.play.silhouette.impl.authenticators.BearerTokenAuthenticator
import com.mohiva.play.silhouette.impl.providers.CredentialsProvider
import error.ErrorIO._
import error.{Errors, SecurityError}
import javax.inject.Inject
import play.api.Configuration
import play.api.i18n.{Lang, MessagesApi}
import play.api.libs.json.{JsValue, Json}
import play.api.mvc._
import security.{MailTokenService, MailTokenUser, QuillEnv}
import utils.Implicits._
import utils.{Actions, Mailer}
import v1.UserIO._
import v1.project.ProjectService
import v1.user._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

class Security @Inject()(
  implicit val builder: DefaultActionBuilder,
  override val messagesApi: MessagesApi,
  val cc: ControllerComponents,
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
) extends AbstractController(cc) {

    implicit val lang: Lang = Lang("en")
    implicit val parser: BodyParser[JsValue] = this.parse.json

    val userExistsError = Errors(List(SecurityError("signup", "validation.email.exists").translate(messagesApi)))
    val userNotFoundError = Errors(List(SecurityError("signin", "signin.error.notfound").translate(messagesApi)))
    val emailNotFoundError = Errors(List(SecurityError("new-password", "signin.error.notfound").translate(messagesApi)))
    val authenticatorExpiry: FiniteDuration = 30 days
    val authenticatorIdleTimeout: FiniteDuration = 5 days
    val authService: AuthenticatorService[BearerTokenAuthenticator] = silhouette.env.authenticatorService
    val eventBus: EventBus = silhouette.env.eventBus

    def signIn: Action[JsValue] = Actions.json[PostedCredentials] { (pc, r) =>
        val credentials = Credentials(pc.identifier, pc.password)
        implicit val request: RequestHeader = r
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

    def signOut: Action[AnyContent] = silhouette.SecuredAction.async { implicit request =>
        eventBus.publish(LogoutEvent(request.identity, request))
        authService.discard(request.authenticator, Ok)
    }

    def signUp: Action[JsValue] = Actions.json[SignUp] { (data, r) =>
        implicit val request: RequestHeader = r
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

    def accountInfo: Action[AnyContent] = silhouette.SecuredAction.async { implicit request =>
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

    def requestPasswordChange: Action[JsValue] = Actions.json[RequestPasswordChange] { (rpc, r) =>
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

    def changePasswordPage(id: String): Action[AnyContent] = Action.async { implicit request =>
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

    def changePassword: Action[JsValue] = Actions.json[PasswordChange] { (pc, r) =>
        implicit val request: RequestHeader = r
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
