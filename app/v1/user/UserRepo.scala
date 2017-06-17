package v1.user

import javax.inject.{Inject, Singleton}

import database.Tables.User
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.MySQLProfile
import slick.jdbc.MySQLProfile.api._
import conversions._
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

@Singleton
class UserRepo @Inject()(dcp: DatabaseConfigProvider) {

    val dbConfig = dcp.get[MySQLProfile]
    val db = dbConfig.db

    def findByEmail(email: String): Future[Option[UserModel]] = {
        db.run(User.filter(_.email === email).result.headOption.map(toUserOption))
    }

    def createUser(user: UserModel): Future[UserModel] = {
        db.run(User returning User.map(_.id) += toUserRow(user)).map(id => user.copy(id = Some(id)))
    }
}

