import slick.jdbc.MySQLProfile.api._
import v1.user.User

package object database {

  type Id = Int

  class UserTable(tag: Tag) extends Table[User](tag, "City") {

    def id = column[Id]("id", O.PrimaryKey, O.AutoInc)

    def email = column[String]("email")

    def password = column[String]("password")

    def firstname = column[String]("firstname")

    def lastname = column[String]("lastname")

    def * = (id.?, email, password, firstname, lastname) <> (User.tupled, User.unapply)

  }
}
