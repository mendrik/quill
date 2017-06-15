package v1.user

import com.mohiva.play.silhouette.api.Identity
import database.types.Id

case class User(
  id: Option[Id],
  email: String,
  password: String,
  firstName: String,
  lastName: String
) extends Identity

case class SignUp(
  identifier: String,
  password: String,
  firstName: String,
  lastName: String
)

case class Credentials(
  identifier: String,
  password: String
)

