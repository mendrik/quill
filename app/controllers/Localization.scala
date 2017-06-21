package controllers

import javax.inject.Inject

import play.api.i18n.MessagesApi
import play.api.libs.json.Json
import play.api.mvc._
import utils.{Message, Messages}
import utils.MessageIO._

class Localization @Inject()(val messagesApi: MessagesApi) extends Controller {

    val LanguageHeader = "Accept-Language"

    def translations = Action { request =>
        val lang = request.headers.get(LanguageHeader).map(_.split("_").head).getOrElse("en")
        val messages = messagesApi.messages.getOrElse(lang, Map.empty)
            .filter(_._1.startsWith("ui."))
            .map { case (key, value) =>
                Message(key, value)
            }
            .toList
        Ok(Json.toJson(Messages(messages)))
    }

}
