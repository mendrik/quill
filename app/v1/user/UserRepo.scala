package v1.user

import javax.inject.Singleton

import io.strongtyped.active.slick.EntityActions
import io.strongtyped.active.slick.JdbcProfileProvider.MySQLProfileProvider
import io.strongtyped.active.slick.Lens._
import slick.ast.BaseTypedType

import scala.language.postfixOps

@Singleton
class UserRepo extends EntityActions with MySQLProfileProvider {

  import jdbcProfile.api._
  val baseTypedType = implicitly[BaseTypedType[Id]]

  type Entity = User
  type Id = Int
  type EntityTable = UserTable

  val tableQuery = TableQuery[UserTable]

  def $id(table: UserTable): Rep[Id] = table.id

  val idLens = lens { user: User => user.id } { (user, id) => user.copy(id = id) }

  class UserTable(tag: Tag) extends Table[User](tag, "user") {
    def id = column[Id]("id", O.PrimaryKey, O.AutoInc)
    def name = column[String]("name")
    def email = column[String]("email")
    def password = column[String]("password")
    def firstname = column[String]("firstname")
    def lastname = column[String]("lastname")
    def * = (id.?, name, email, password, firstname, lastname) <> (User.tupled, User.unapply)
  }

  def findByName(name: String): DBIO[Seq[User]] = {
    tableQuery.filter(_.name === name).result
  }

}

