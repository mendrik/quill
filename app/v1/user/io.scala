package v1.user

import play.api.libs.json._ // Combinator syntax

package object ReadsAndWrites {

  implicit val signupReads: Reads[SignUp] = Json.reads[SignUp]

  implicit val userWrites: Writes[User] = Json.writes[User]

}
