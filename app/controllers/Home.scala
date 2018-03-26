package controllers

import javax.inject.Inject
import play.api.Configuration
import play.api.mvc._
import utils.Implicits._

class Home @Inject()(
    val conf: Configuration,
    val cc: ControllerComponents,
    val assetFinder: AssetsFinder
) extends AbstractController(cc) {

    def index = Action { request =>
        Ok(views.html.index(conf, assetFinder))
    }

    def project(id: String): Action[AnyContent] = Action.async { request =>
        Ok(views.html.index(conf, assetFinder))
    }

}
