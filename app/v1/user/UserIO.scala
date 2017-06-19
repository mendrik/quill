package v1

import play.api.libs.json._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._
import v1.user.{SignUp, User}

package object UserIO {

    implicit val signupReads: Reads[SignUp] = (
        (__ \ "firstname").read[String](minLength[String](1)) and
        (__ \ "lastname").read[String](minLength[String](1)) and
        (__ \ "email").read[String](email) and
        (__ \ "password").read[String](minLength[String](6))
    )(SignUp.apply _)

    implicit val userWrites: Writes[User] = Json.writes[User]

}
