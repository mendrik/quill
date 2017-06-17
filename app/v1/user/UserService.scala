package v1.user

import javax.inject.Inject

import com.mohiva.play.silhouette.api.LoginInfo
import security.SecurityUserService
import v1.user.conversions._

import scala.concurrent.{ExecutionContext, Future}

class UserService @Inject() (repo: UserRepo)(implicit ec: ExecutionContext) extends SecurityUserService {

  override def retrieve(loginInfo: LoginInfo) = repo.findByEmail(loginInfo.providerKey).map(toOptionUser)

  def createUser(user: User) = repo.createUser(user)

}
