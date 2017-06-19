package error

import javax.inject._

import play.api.i18n.MessagesApi
import play.api.libs.json._

@Singleton
class ErrorIO @Inject()(messagesApi: MessagesApi) {

    implicit val writeValidationError = new Writes[ValidationError] {
        def writes(e: ValidationError) = Json.obj(
            "type" -> "validation",
            "field" -> e.field,
            "message" -> messagesApi.translate(e.messageKey, Seq())
        )
    }

    implicit val writeValidationErrorList = Json.writes[ValidationErrors]

}
