package v1

import com.mohiva.play.silhouette.api.util.PasswordInfo
import play.api.data.validation.ValidationError
import play.api.libs.json._
import play.api.libs.json.Reads._
import json.JsPathExtra
import play.api.libs.functional.syntax._
import v1.user.{PostedCredentials, SignUp, User}

package object UserIO {

    private def err(msgKey: String) = Reads[String](_ => JsError(ValidationError(msgKey)))

    implicit val signupReads: Reads[SignUp] = (
        (__ \ "firstname").nonEmpty ~
        (__ \ "lastname").nonEmpty ~
        (__ \ "email").nonEmptyWith(email) ~
        (__ \ "password").nonEmptyWith(minLength(6))
    )(SignUp.apply _)

    implicit val passwordInfoFormat = (
        (__ \ "hasher").format[String] ~
        (__ \ "password").format[String] ~
        (__ \ "salt").formatNullable[String]) (PasswordInfo.apply, unlift(PasswordInfo.unapply))

    implicit val credentialsReads: Reads[PostedCredentials] = (
        (__ \ "identifier").nonEmptyWith(email) ~
        (__ \ "password").nonEmpty
    )(PostedCredentials.apply _)

    implicit val userWrites: Writes[User] = Json.writes[User]

}
