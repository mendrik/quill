package controllers

import javax.inject.Inject

import play.api.i18n.MessagesApi
import play.api.mvc.Action

class Home @Inject() (val messagesApi: MessagesApi) extends api.ApiController {

  def index = Action { implicit request =>
    Ok(views.html.index())
  }

  def project(id: String) = Action { implicit request =>
    Ok(views.html.index())
  }

}
