package v1.user

import com.mohiva.play.silhouette.api.Identity
import play.api.libs.json.{ Json, Reads }

case class User(
    id: Option[Int],
    email: String,
    password: String,
    firstname: String,
    lastname: String
) extends Identity {

}

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
