package v1.user

import javax.inject.{Inject, Singleton}
import database.Tables._
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.MySQLProfile
import slick.jdbc.MySQLProfile.api._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class UserRepo @Inject()(dcp: DatabaseConfigProvider) {

    val dbConfig = dcp.get[MySQLProfile]
    val db = dbConfig.db

    def findByEmail(email: String): Future[Option[User]] = {
        db.run(Users.filter(_.email === email).result.headOption.map(_.map(toUser)))
    }

    def findById(id: Long): Future[User] = {
        db.run(Users.filter(_.id === id).result.head.map(toUser))
    }

    def createUser(signUp: SignUp): Future[User] = {
        db.run(Users returning Users.map(_.id) += toUsersRow(signUp)).flatMap(findById)
    }

    def toUser(userRow: UsersRow) =
        User(userRow.id, userRow.email, userRow.password, userRow.firstname, userRow.lastname)

    def toUsersRow(signUp: SignUp) =
        UsersRow(0, signUp.email, signUp.password, signUp.firstName, signUp.lastName)

}

