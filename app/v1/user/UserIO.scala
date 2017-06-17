package v1

import play.api.libs.json._
import v1.user.{SignUp, User} // Combinator syntax

package object UserIO {

  implicit val signupReads: Reads[SignUp] = Json.reads[SignUp]

  implicit val userWrites: Writes[User] = Json.writes[User]

}
