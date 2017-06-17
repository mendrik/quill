package v1.user

import com.mohiva.play.silhouette.api.Identity
import database.Tables._

case class User(
  id: Option[Int],
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

package object conversions {

    implicit def toUserRow(user: v1.user.User): UserRow =
        UserRow(user.id.orNull, user.email, user.password, user.firstName, user.lastName)

    implicit def toUser(userRow: UserRow): User =
        v1.user.User(Option(userRow.id), userRow.email, userRow.password, userRow.firstname, userRow.lastname)

    implicit def toOptionUser(userRowOption: Option[UserRow]): Option[User] = userRowOption.map(toUser)
}
