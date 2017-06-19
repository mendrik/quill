package error

import javax.inject._

import play.api.i18n.{Messages, MessagesApi}
import play.api.libs.json._ // Combinator syntax

@Singleton
class ErrorIO @Inject()(messagesApi: MessagesApi) {

    implicit val writeValidationError: Writes[ValidationError] = new Writes[ValidationError] {
        def writes(e: ValidationError) = Json.obj(
            "field" -> e.field,
            "message" -> messagesApi.translate(e.messageKey, Seq())
        )
    }

}
