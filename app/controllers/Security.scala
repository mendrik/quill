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
import utils.{Actions, Mailer}
import security.Implicits._
import security.{MailTokenService, MailTokenUser, QuillEnv}
import v1.UserIO._
import v1.user._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

class Security @Inject()(
  val messagesApi: MessagesApi,
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

    val emailExistsMessage = messagesApi.translate("validation.email.exists", Nil).getOrElse("")
    val userNotFoundMessage = messagesApi.translate("signin.error.notfound", Nil).getOrElse("")
    val userExistsError = Errors(List(SecurityError("signup.email", emailExistsMessage)))
    val userNotFoundError = Errors(List(SecurityError("signin.error", userNotFoundMessage)))
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
                    Future.successful(Unauthorized(Json.toJson(userNotFoundError)))
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
                Future.successful(BadRequest(Json.toJson(userExistsError)))
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
        Future.successful(Ok(Json.toJson(request.identity)))
    }

    def requestPasswordChange = Actions.json[RequestPasswordChange](Some("forgot-password")) { (rpc, r) =>
        val token = MailTokenUser(rpc.identifier)
        implicit val request = r
        for {
            Some(user) <- userService.retrieve(rpc.identifier)
            Some(token) <- mailTokenService.create(token)
        } yield {
            mailer.forgotPassword(user.email, link = routes.Security.changePassword(token.id).absoluteURL())
            Ok
        }
    }

    def changePasswordPage(id: String) = silhouette.UnsecuredAction.async { implicit request =>
        for {
            Some(token) <- mailTokenService.retrieve(id)
        } yield {
            if (!token.isExpired) {
                Ok(views.html.index())
            }
            else {
                mailTokenService.consume(id)
                NotFound
            }
        }
    }

    def changePassword(id: String) = Actions.json[PasswordChange](Some("new-password")) { (pc, r) =>
        implicit val request = r
        (for {
            Some(token: MailTokenUser) <- mailTokenService.retrieve(id)
            Some(user) <- userService.retrieve(token.email) if !token.isExpired
            _ <- authInfoRepository.update(token.email, passwordHasher.hash(pc.password))
            authenticator <- authService.create(user.email)
            result <- authService.renew(authenticator, Ok)
        } yield {
            result
        })
        .fallbackTo(Future.successful(Unauthorized))
    }

    private def updatedAuthenticator(a: BearerTokenAuthenticator) = a.copy(
        expirationDateTime = clock.now.plus(authenticatorExpiry.toMillis),
        idleTimeout = None
    )

}
