package error

import javax.inject._

import play.api.i18n.MessagesApi
import play.api.libs.json._

@Singleton
class ErrorIO {

    implicit val writeValidationError = new Writes[Error] {
        def writes(e: Error) = Json.obj(
            "type" -> e.errorType,
            "field" -> e.title,
            "message" -> e.message
        )
    }

    implicit val writeValidationErrorList = Json.writes[Errors]

}
