package security

import org.joda.time.DateTime
import play.api.libs.json.{JsString, JsValue, Json, Writes}

case class Token(token: String, expiresOn: DateTime)

/**
  * Companion object, contain format for Json
  */
object Token {

    implicit val jodaDateWrites = new Writes[DateTime] {
        def writes(d: DateTime): JsValue = JsString(d.toString)
    }

    implicit val restFormat = Json.format[Token]

}
