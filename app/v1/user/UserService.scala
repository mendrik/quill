package v1.user

import javax.inject._

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.api.services.IdentityService

import scala.concurrent.Future

class UserService @Inject()(repo: UserRepo) extends IdentityService[User] {

    def retrieve(loginInfo: LoginInfo): Future[Option[User]] = repo.findByEmail(loginInfo.providerKey)

    def createUser(signUp: SignUp) = repo.createUser(signUp)

}
