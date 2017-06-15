package v1.user

import javax.inject.{ Inject, Singleton }
import database.UserTable
import io.strongtyped.active.slick.EntityActions
import io.strongtyped.active.slick.JdbcProfileProvider.MySQLProfileProvider
import io.strongtyped.active.slick.Lens._
import slick.ast.BaseTypedType
import slick.jdbc.JdbcProfile
import play.api.db.slick.DatabaseConfigProvider
import slick.lifted.{ Rep, TableQuery }

import scala.concurrent.Future
import scala.language.postfixOps

@Singleton
class UserRepo @Inject() (dcp: DatabaseConfigProvider) extends EntityActions with MySQLProfileProvider {

  val dbConfig = dcp.get[JdbcProfile]

  val baseTypedType = implicitly[BaseTypedType[Id]]

  type Id = Int
  type EntityTable = UserTable

  val tableQuery = TableQuery[UserTable]
  def $id(table: UserTable): Rep[Id] = table.id
  val idLens = lens { user: User => user.id } { (user, id) => user.copy(id = id) }
  type Entity = User

  def findByEmail(email: String): Future[Option[User]] = {
    // db.run(tableQuery.filter(_.email === email))
    Future.successful(None)
  }

}

