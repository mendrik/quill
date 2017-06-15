package v1.user

import javax.inject.{ Inject, Singleton }

import database.UserTable
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile
import slick.jdbc.MySQLProfile.api._
import slick.lifted.TableQuery

import scala.concurrent.ExecutionContext.Implicits.global

@Singleton
class UserRepo @Inject() (dcp: DatabaseConfigProvider) {

  def users = TableQuery[UserTable]

  val dbConfig = dcp.get[JdbcProfile]
  val db = dbConfig.db

  def findByEmail(email: String) = db.run {
    users.filter(_.email === email).result.headOption
  }

  val insertQuery = users returning users.map(_.id) into ((user, id) => user.copy(id = Some(id)))

  def createUser(user: User) = db.run {
    insertQuery += user
  }

}

