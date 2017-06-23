package security

import javax.inject.Inject

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.api.repositories.AuthenticatorRepository
import com.mohiva.play.silhouette.api.util.PasswordInfo
import com.mohiva.play.silhouette.impl.authenticators.BearerTokenAuthenticator
import com.mohiva.play.silhouette.persistence.daos.DelegableAuthInfoDAO
import org.joda.time.DateTime
import play.api.Configuration
import security.Implicits._
import v1.token.TokenRepo
import v1.user.{User, UserRepo}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class SecurityService @Inject()(
    config: Configuration,
    userRepo: UserRepo,
    tokenRepo: TokenRepo
) extends DelegableAuthInfoDAO[PasswordInfo]
  with AuthenticatorRepository[BearerTokenAuthenticator] {

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
            Some(user: User) <- userRepo.findByEmail(a.loginInfo.providerKey)
            Some(token: Token) <- tokenRepo.createToken(Token(a.id, user.id, a.lastUsedDateTime, a.expirationDateTime))
        } yield {
            bearerToken(token, user)
        }
    }

    override def update(a: BearerTokenAuthenticator): Future[BearerTokenAuthenticator] = {
        for {
            Some(user) <- userRepo.findByEmail(a.loginInfo.providerKey)
        } yield {
            val token = Token(a.id, user.id, a.lastUsedDateTime, a.expirationDateTime)
            tokenRepo.update(token)
            bearerToken(token, user)
        }
    }

    override def remove(id: String): Future[Unit] = tokenRepo.remove(id)

    def add(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] =
        update(loginInfo, authInfo)

    def find(loginInfo: LoginInfo): Future[Option[PasswordInfo]] =
        userRepo.findByEmail(loginInfo.providerKey).map {
            case Some(user) => Some(user.password) 
            case _ => None
        }

    def remove(loginInfo: LoginInfo): Future[Unit] = {
        for {
            Some(user) <- userRepo.findByEmail(loginInfo.providerKey)
        } yield {
            userRepo.remove(user)
        }
    }

    def save(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] =
        find(loginInfo).flatMap {
            case Some(_) => update(loginInfo, authInfo)
            case None => add(loginInfo, authInfo)
        }

    def update(loginInfo: LoginInfo, authInfo: PasswordInfo): Future[PasswordInfo] =
        userRepo.findByEmail(loginInfo).map {
            case Some(user) =>
                userRepo.update(user.copy(password = authInfo))
                authInfo
            case _ =>
                throw new Exception("PasswordInfoDAO - update : the user must exists to update its password")
        }

    private def bearerToken(token: Token, user: User) = BearerTokenAuthenticator(
        token.id,
        user.email,
        token.lastUsed,
        DateTime.now().plusMonths(3),
        None
    )

}
