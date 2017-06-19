package error

import javax.inject._
import play.api.i18n.Messages
import play.api.libs.json._ // Combinator syntax

@Singleton
class ErrorIO @Inject()(messages: Messages) {

    implicit val writeValidationError: Writes[ValidationError] = new Writes[ValidationError] {
        def writes(e: ValidationError) = Json.obj(
            "field" -> e.field,
            "message" -> messages.translate(e.messageKey, Seq())
        )
    }

}
