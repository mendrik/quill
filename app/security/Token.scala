package security

import org.joda.time.DateTime
import play.api.libs.json.{JsString, JsValue, Writes}

case class Token(
    id: String,
    user: Long,
    lastUsed: DateTime,
    expiration: DateTime
)

object Token {

    implicit val jodaDateWrites = new Writes[DateTime] {
        def writes(d: DateTime): JsValue = JsString(d.toString)
    }

}
