import scala.concurrent.ExecutionContext.Implicits.global
import play.api.Play
import play.api.db.slick.DatabaseConfigProvider
import slick.driver.JdbcProfile
import slick.driver.MySQLDriver.api._
import v1.user.User

import scala.concurrent.Future


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
