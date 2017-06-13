package controllers

import javax.inject.Inject

import play.api.i18n.MessagesApi
import play.api.mvc._

import scala.concurrent.Future

class Security @Inject() (val messagesApi: MessagesApi) extends Controller {

  def signIn = Action.async { request =>
    Future.successful(Ok(""))
  }

  def signOut = Action.async { request =>
    Future.successful(Ok(""))
  }

  def signUp = Action.async { request =>
    Future.successful(Ok(""))
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
