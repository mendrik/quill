package v1.user

import javax.inject.{Inject, Singleton}

import database.Tables._
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.MySQLProfile
import slick.jdbc.MySQLProfile.api._

@Singleton
class UserRepo @Inject()(dcp: DatabaseConfigProvider) {

    val dbConfig = dcp.get[MySQLProfile]
    val db = dbConfig.db

    def findByEmail(email: String) = db.run {
        User.filter(_.email === email).result.headOption
    }

    val insertQuery = User returning User.map(_.id) into ((user, id) => user.copy(id = id))

    def createUser(user: v1.user.User) = db.run {
        insertQuery += userToUsersRow(user)
    }

    private def userToUsersRow(user: User): UserRow = {
        UserRow(user.id.orNull, user.email, user.password, user.firstName, user.lastName)
    }
}

