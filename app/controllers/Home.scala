package controllers

import javax.inject.Inject

import play.api.i18n.MessagesApi
import play.api.mvc._
import utils.Implicits._
import scala.concurrent.Future

class Home @Inject()(
    override val messagesApi: MessagesApi,
    val cc: ControllerComponents
) extends AbstractController(cc) {

    def index = Action { request =>
        Ok(views.html.index())
    }

    def project(id: String): Action[AnyContent] = Action.async { request =>
        Ok(views.html.index())
    }

}
