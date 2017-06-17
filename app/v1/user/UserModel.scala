package v1.user

import com.mohiva.play.silhouette.api.Identity
import database.Tables.UserRow

case class UserModel(
  id: Option[Long],
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

    def toUserRow(user: v1.user.UserModel): UserRow =
        UserRow(user.id.get, user.email, user.password, user.firstName, user.lastName)

    def toUser(userRow: UserRow): UserModel =
        v1.user.UserModel(Option(userRow.id), userRow.email, userRow.password, userRow.firstname, userRow.lastname)

    def toUserOption(userRowOption: Option[UserRow]): Option[UserModel] = userRowOption.map(toUser)
}
