package v1.user

import com.mohiva.play.silhouette.api.Identity
import database.Tables.UsersRow

case class User(
  id: Long,
  email: String,
  password: String,
  firstName: String,
  lastName: String
) extends Identity {
}

case class SignUp(
    email: String,
    password: String,
    firstName: String,
    lastName: String
)

case class Credentials(
  identifier: String,
  password: String
)

