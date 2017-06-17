package v1.user

import database.Tables._

package object Conversions {

    implicit class UsersRowOps(userRow: UsersRow) {

        def toUser =
            User(userRow.id, userRow.email, userRow.password, userRow.firstname, userRow.lastname)

    }

    implicit class SignUpOps(signUp: SignUp) {

        def toUsersRow =
            UsersRow(0, signUp.email, signUp.password, signUp.firstName, signUp.lastName)

    }

}

