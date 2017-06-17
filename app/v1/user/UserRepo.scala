package v1.user

import javax.inject.{Inject, Singleton}
import database.Tables.Users
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.MySQLProfile
import slick.jdbc.MySQLProfile.api._
import v1.user.Conversions.{SignUpOps, UsersRowOps}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class UserRepo @Inject()(dcp: DatabaseConfigProvider) {

    val dbConfig = dcp.get[MySQLProfile]
    val db = dbConfig.db

    def findByEmail(email: String): Future[Option[User]] = {
        db.run(Users.filter(_.email === email).result.headOption.map(_.map(_.toUser)))
    }

    def findById(id: Long): Future[User] = {
        db.run(Users.filter(_.id === id).result.head.map(_.toUser))
    }

    def createUser(signUp: SignUp): Future[User] = {
        db.run(Users returning Users.map(_.id) += signUp.toUsersRow).flatMap(findById)
    }
}

