package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.api.util.{Credentials, PasswordHasher}
import com.mohiva.play.silhouette.api.{LoginEvent, LoginInfo, SignUpEvent, Silhouette}
import com.mohiva.play.silhouette.impl.providers.CredentialsProvider
import error.{Errors, ReadError}
import play.api.i18n.MessagesApi
import play.api.libs.json.Json
import play.api.mvc._
import security.Implicits._
import security.QuillEnv
import utils.Actions
import v1.UserIO._
import v1.user.{PostedCredentials, SignUp, User, UserService}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Security @Inject()(
  val messagesApi: MessagesApi,
  val userService: UserService,
  val silhouette: Silhouette[QuillEnv],
  val passwordHasher: PasswordHasher,
  val authInfoRepository: AuthInfoRepository,
  val credentialsProvider: CredentialsProvider
) extends Controller {

    val emailExistsMessage = messagesApi.translate("validation.email.exists", Nil).getOrElse("")
    val userExistsErrors = Errors(Seq(ReadError("signup.email", emailExistsMessage)))

    def signIn = Actions.json[PostedCredentials](Some("signin")) { pc =>
        val credentials = Credentials(pc.identifier, pc.password)
        println(passwordHasher.hash(pc.password))
        credentialsProvider.authenticate(credentials).map { loginInfo =>
            Ok(Json.toJson(loginInfo))
        }
    }

    def signOut = Action.async { request =>
        Future.successful(Ok(""))
    }

    def signUp = Actions.json[SignUp](Some("signup")) { data =>
        val loginInfo = LoginInfo(CredentialsProvider.ID, data.email)
        userService.retrieve(loginInfo).map {
            case Some(user) =>
                BadRequest(Json.toJson(userExistsErrors))
            case None =>
                val authInfo = passwordHasher.hash(data.password)
                for {
                    Some(user) <- userService.createUser(data)
                    authInfo <- authInfoRepository.add(loginInfo, authInfo)
                    authenticator <- silhouette.env.authenticatorService.create(loginInfo)
                    token <- silhouette.env.authenticatorService.init(authenticator)
                } yield {
                    // silhouette.env.eventBus.publish(SignUpEvent(user, request))
                    // silhouette.env.eventBus.publish(LoginEvent(user, request))
                    Ok(Json.obj("token" -> token))
                }
        }
    }

    def accountInfo = Action.async { request =>
        Future.successful(Ok(""))
    }

    def requestPasswordChange = Action.async { request =>
        Future.successful(Ok(""))
    }

    def changePassword = Action.async { request =>
        Future.successful(Ok(""))
    }


}
