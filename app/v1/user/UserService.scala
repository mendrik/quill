package v1.user

import javax.inject.Inject

import com.mohiva.play.silhouette.api.LoginInfo
import security.SecurityUserService

import scala.concurrent.ExecutionContext

class UserService @Inject() (repo: UserRepo)(implicit ec: ExecutionContext) extends SecurityUserService {

  override def retrieve(loginInfo: LoginInfo) = repo.findByEmail(loginInfo.providerKey)

  def createUser(user: User) = repo.createUser(user).map(u => user.copy(id = u.id))
}
