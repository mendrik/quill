package v1.user

import play.api.libs.json._ // Combinator syntax

package object jsonio {

  implicit val signupReads: Reads[SignUp] = Json.reads[SignUp]

  implicit val userWrites: Writes[UserModel] = Json.writes[UserModel]

}
