package v1.user

import javax.inject.Inject

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.api.util.PasswordInfo
import com.mohiva.play.silhouette.persistence.daos.DelegableAuthInfoDAO
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.MySQLProfile

import scala.concurrent.Future

class PasswordRepo @Inject()(
    dcp: DatabaseConfigProvider,
    userRepo: UserRepo
) extends DelegableAuthInfoDAO[PasswordInfo] {

    private val dbConfig = dcp.get[MySQLProfile]
    private val db = dbConfig.db

    override def find(loginInfo: LoginInfo): Future[Option[PasswordInfo]] = ???
    override def add(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] = ???
    override def update(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] = ???
    override def save(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] = ???
    override def remove(loginInfo: LoginInfo): Future[Unit] = ???
}
