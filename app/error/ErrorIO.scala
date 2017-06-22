package error

import play.api.libs.json._

object ErrorIO {

    implicit val writeError: Writes[Error] = new Writes[Error] {
        def writes(e: Error) = Json.obj(
            "type" -> e.errorType,
            "title" -> e.title,
            "message" -> e.message
        )
    }

    implicit val writeErrors: Writes[Errors] = Json.writes[Errors]

}
