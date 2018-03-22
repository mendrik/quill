package controllers

import javax.inject.Inject
import play.api.Configuration
import play.api.mvc._
import utils.Implicits._

class Home @Inject()(
    val conf: Configuration,
    val cc: ControllerComponents
) extends AbstractController(cc) {

    def index = Action { request =>
        Ok(views.html.index(conf))
    }

    def project(id: String): Action[AnyContent] = Action.async { request =>
        Ok(views.html.index(conf))
    }

}
