package error

import javax.inject._

import play.api.i18n.MessagesApi
import play.api.libs.json._

@Singleton
class ErrorIO {

    implicit val writeValidationError = new Writes[ReadError] {
        def writes(e: ReadError) = Json.obj(
            "type" -> "validation",
            "field" -> e.field,
            "message" -> e.message
        )
    }

    implicit val writeValidationErrorList = Json.writes[ReadsErrors]

}
