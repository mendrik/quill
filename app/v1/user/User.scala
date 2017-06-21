package v1.user

import com.mohiva.play.silhouette.api.Identity

case class User(
  id: Long,
  email: String,
  password: String,
  firstName: String,
  lastName: String
) extends Identity {
}

case class SignUp(
    firstName: String,
    lastName: String,
    email: String,
    password: String
)

case class Credentials(
  identifier: String,
  password: String
)

