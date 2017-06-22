package v1

import play.api.data.validation.ValidationError
import play.api.libs.json._
import play.api.libs.json.Reads._
import json.JsPathExtra
import play.api.libs.functional.syntax._
import v1.user.{Credentials, SignUp, User}

package object UserIO {

    private def err(msgKey: String) = Reads[String](_ => JsError(ValidationError(msgKey)))

    implicit val signupReads: Reads[SignUp] = (
        (__ \ "firstname").nonEmpty ~
        (__ \ "lastname").nonEmpty ~
        (__ \ "email").nonEmptyWith(email) ~
        (__ \ "password").nonEmptyWith(minLength(6))
    )(SignUp.apply _)

    implicit val credentialsReads: Reads[Credentials] = (
        (__ \ "identifier").nonEmptyWith(email) ~
        (__ \ "password").nonEmpty
    )(Credentials.apply _)

    implicit val userWrites: Writes[User] = Json.writes[User]

}
