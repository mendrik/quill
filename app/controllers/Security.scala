package controllers

import javax.inject.Inject

import play.api.i18n.MessagesApi
import play.api.libs.json.{JsError, JsSuccess, JsValue, Json}
import play.api.mvc._
import utils.Actions
import utils.Actions.JsonRequest
import v1.UserIO._
import v1.user.{SignUp, UserService}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Security @Inject() (
    messagesApi: MessagesApi,
    userService: UserService
) extends Controller {

  def signIn = Action.async { request =>
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
