package controllers

import javax.inject.Inject

import play.api.i18n.MessagesApi
import play.api.libs.json.{JsError, JsSuccess, Json}
import play.api.mvc._
import v1.user.{SignUp, UserService}
import v1.user.ReadsAndWrites._
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

  def signUp = Action.async(parse.json) { request =>
    request.body.validate[SignUp] match {
      case JsSuccess(signUp, _) =>
        userService.createUser(signUp)
        .map(u => Ok(Json.toJson(u)))
      case JsError(e) =>
        Future.successful(BadRequest(e.toString))
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
