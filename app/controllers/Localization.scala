package controllers

import javax.inject.Inject
import play.api.i18n.{MessagesApi}
import play.api.libs.json.{JsValue, Json}
import play.api.mvc._
import utils.MessageIO._
import utils.{Message, Messages}

class Localization @Inject()(
    override val messagesApi: MessagesApi,
    val cc: ControllerComponents
) extends AbstractController(cc) {

    val LanguageHeader = "Accept-Language"
    implicit val parser: BodyParser[JsValue] = this.parse.json

    def translations = Action { request =>
        implicit val lang: String = request.headers.get(LanguageHeader).map(_.split("_").head).getOrElse("en")
        val messages = messagesApi.messages.getOrElse(lang, Map.empty)
            .filter(_._1.startsWith("ui."))
            .map { case (key, value) =>
                Message(key, value)
            }
            .toList
        Ok(Json.toJson(Messages(messages)))
    }

}
