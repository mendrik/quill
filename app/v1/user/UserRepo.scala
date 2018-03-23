package v1.user

import javax.inject.{Inject, Singleton}

import database.Tables._
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.PostgresProfile
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class UserRepo @Inject()(dcp: DatabaseConfigProvider) {

    private val dbConfig = dcp.get[PostgresProfile]
    private val db = dbConfig.db

    def findByEmail(email: String): Future[Option[User]] =
        db.run(Users.filter(_.email === email).result.headOption.map(_.map(toUser)))

    def findById(id: Int): Future[Option[User]] =
        db.run(Users.filter(_.id === id).result.headOption.map(_.map(toUser)))

    def createUser(signUp: SignUp): Future[Option[User]] =
        db.run(Users returning Users.map(_.id) += signUp).flatMap(findById)

    def update(user: User) =
        db.run(Users.filter(_.id === user.id)
            .map(u => (u.email, u.password, u.firstname, u.lastname, u.confirmed, u.lastProject))
            .update((user.email, user.password, user.firstName, user.lastname, user.confirmed, user.lastProject)))

    def remove(user: User) =
        db.run(Users.filter(_.id === user.id).delete)

    def toUser(row: UsersRow): User =
        User(row.id, row.email, row.confirmed,
            row.password, row.firstname, row.lastname, row.lastProject)

    implicit def toUsersRow(signUp: SignUp): UsersRow =
        UsersRow(0, signUp.email, signUp.password, signUp.firstName, signUp.lastName)

    implicit def toUsersRow(user: User): UsersRow =
        UsersRow(user.id, user.email, user.password, user.firstName, user.lastName,
            user.confirmed, user.lastProject)

}

