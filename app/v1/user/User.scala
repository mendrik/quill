package v1.user

import play.api.libs.json.{ Json, Reads }

case class User(
  id: Option[Int],
  name: String,
  email: String,
  password: String,
  firstname: String,
  lastname: String
)

case class SignUp(
  identifier: String,
  password: String,
  firstName: Option[String],
  lastName: Option[String]
)

case class Credentials(
  identifier: String,
  password: String
)

object SignUp {
  implicit val reads: Reads[SignUp] = Json.reads[SignUp]
}
