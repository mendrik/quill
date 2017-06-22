package security

import javax.inject.Inject

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.api.repositories.AuthenticatorRepository
import com.mohiva.play.silhouette.api.util.PasswordInfo
import com.mohiva.play.silhouette.impl.authenticators.BearerTokenAuthenticator
import com.mohiva.play.silhouette.persistence.daos.DelegableAuthInfoDAO
import org.joda.time.DateTime
import v1.token.TokenRepo
import v1.user.{User, UserRepo}
import scalaz._, Scalaz._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import scala.concurrent.Future

class SecurityService @Inject()(userRepo: UserRepo, tokenRepo: TokenRepo)
    extends DelegableAuthInfoDAO[PasswordInfo]
    with AuthenticatorRepository[BearerTokenAuthenticator] {

    def providerId = "quill-security"

    override def find(id: String): Future[Option[BearerTokenAuthenticator]] = {
        (for {
            Some(token) <- tokenRepo.findById(id)
            Some(user)  <- userRepo.findById(token.user)
            bearer      <- Future.successful(bearerToken(token, user))
        } yield Option(bearer))
        .fallbackTo(Future.successful(None))
    }

    override def add(a: BearerTokenAuthenticator): Future[BearerTokenAuthenticator] = {
        for {
            Some(user) <- userRepo.findByEmail(a.loginInfo.providerKey)
            Some(token) <- tokenRepo.createToken(Token(a.id, user.id, a.lastUsedDateTime))
        } yield {
            bearerToken(token, user)
        }
    }

    override def update(authenticator: BearerTokenAuthenticator): Future[BearerTokenAuthenticator] = ???

    override def remove(id: String): Future[Unit] = ???

    override def find(loginInfo: LoginInfo): Future[Option[PasswordInfo]] = ???

    override def add(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] = ???

    override def update(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] = ???

    override def save(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] = ???

    override def remove(loginInfo: LoginInfo): Future[Unit] = ???

    private def bearerToken(token: Token, user: User) = BearerTokenAuthenticator(
        token.id,
        LoginInfo(providerId, user.email),
        token.lastUsed,
        DateTime.now().plusMonths(3),
        None
    )
}
