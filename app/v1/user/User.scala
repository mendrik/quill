package v1.user

import com.mohiva.play.silhouette.api.Identity

case class User(
  id: Option[Int],
  email: String,
  password: String,
  firstName: String,
  lastName: String
) extends Identity

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

