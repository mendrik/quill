package security

import javax.inject.Inject

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.api.repositories.AuthenticatorRepository
import com.mohiva.play.silhouette.api.util.PasswordInfo
import com.mohiva.play.silhouette.impl.authenticators.BearerTokenAuthenticator
import com.mohiva.play.silhouette.persistence.daos.DelegableAuthInfoDAO
import v1.user.UserRepo

import scala.concurrent.Future

class SecurityService @Inject()(userRepo: UserRepo) extends DelegableAuthInfoDAO[PasswordInfo] with AuthenticatorRepository[BearerTokenAuthenticator] {

    override def find(id: String): Future[Option[BearerTokenAuthenticator]] = ???
    override def add(authenticator: BearerTokenAuthenticator): Future[BearerTokenAuthenticator] = ???
    override def update(authenticator: BearerTokenAuthenticator): Future[BearerTokenAuthenticator] = ???
    override def remove(id: String): Future[Unit] = ???
    override def find(loginInfo: LoginInfo): Future[Option[PasswordInfo]] = ???
    override def add(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] = ???
    override def update(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] = ???
    override def save(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] = ???
    override def remove(loginInfo: LoginInfo): Future[Unit] = ???

}
