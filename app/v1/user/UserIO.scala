package v1

import play.api.data.validation.ValidationError
import play.api.libs.json._
import play.api.libs.json.Reads._
import json._
import play.api.libs.functional.syntax._
import v1.user.{SignUp, User}

package object UserIO {

    private def err(msgKey: String) = Reads[String](_ => JsError(ValidationError(msgKey)))

    implicit val signupReads: Reads[SignUp] = (
        (__ \ "firstname").nonEmpty ~
        (__ \ "lastname").nonEmpty ~
        (__ \ "email").nonEmpty(email) ~
        (__ \ "password").read[String](minLength[String](6))
    )(SignUp.apply _)

    implicit val userWrites: Writes[User] = Json.writes[User]

}
