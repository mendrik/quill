package v1.user

import javax.inject._

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.api.repositories.AuthenticatorRepository
import com.mohiva.play.silhouette.api.services.IdentityService
import com.mohiva.play.silhouette.impl.authenticators.BearerTokenAuthenticator

import scala.concurrent.Future

class UserService @Inject()(repo: UserRepo) extends IdentityService[User] with AuthenticatorRepository[BearerTokenAuthenticator] {

    def retrieve(loginInfo: LoginInfo): Future[Option[User]] = repo.findByEmail(loginInfo.providerKey)

    def createUser(signUp: SignUp) = repo.createUser(signUp)


    override def find(id: String): Future[Option[BearerTokenAuthenticator]] = ???

    override def add(authenticator: BearerTokenAuthenticator): Future[BearerTokenAuthenticator] = ???

    override def update(authenticator: BearerTokenAuthenticator): Future[BearerTokenAuthenticator] = ???

    override def remove(id: String): Future[Unit] = ???

}
