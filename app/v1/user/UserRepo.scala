package v1.user

import javax.inject.{Inject, Singleton}

import database.Tables._
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.MySQLProfile
import slick.jdbc.MySQLProfile.api._

import scala.concurrent.Future

@Singleton
class UserRepo @Inject()(dcp: DatabaseConfigProvider) {

    val dbConfig = dcp.get[MySQLProfile]
    val db = dbConfig.db

    def findByEmail(email: String): Future[Option[UserRow]] = {
        db.run(User.filter(_.email === email).result.headOption)
    }

    val insertQuery = User returning User.map(_.id) into ((user, id) => user.copy(id = id))

    def createUser(user: UserRow): Future[User] = {
        db.run(insertQuery += user)
    }
}

