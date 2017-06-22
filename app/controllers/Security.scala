package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api.Silhouette
import play.api.i18n.MessagesApi
import play.api.libs.json.Json
import play.api.mvc._
import security.QuillEnv
import utils.Actions
import v1.UserIO._
import v1.user.{Credentials, SignUp, UserService}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Security @Inject()(
  val messagesApi: MessagesApi,
  val userService: UserService,
  val silhouette: Silhouette[QuillEnv]
) extends Controller {

    def signIn = Actions.json[Credentials](Some("signin")) { credentials =>
        Future.successful(Ok(""))
    }

    def signOut = Action.async { request =>
        Future.successful(Ok(""))
    }

    def signUp = Actions.json[SignUp](Some("signup")) { signup =>
        userService.createUser(signup).map(u => Ok(Json.toJson(u)))
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
