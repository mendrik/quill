package controllers

import javax.inject.Inject

import play.api.i18n.MessagesApi
import play.api.mvc._

import scala.concurrent.Future

class Home @Inject() (val messagesApi: MessagesApi) extends Controller {

  def index = Action { request =>
    Ok(views.html.index())
  }

  def project(id: String) = Action.async { request =>
    Future.successful(Ok(views.html.index()))
  }

}
