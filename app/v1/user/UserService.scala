package v1.user

import scala.concurrent.{ ExecutionContext, Future }
import javax.inject.Inject
import com.mohiva.play.silhouette.api.LoginInfo
import security.SecurityUserService

class UserService @Inject() (repo: UserRepo)(implicit ec: ExecutionContext) extends SecurityUserService {

  override def retrieve(loginInfo: LoginInfo): Future[Option[User]] = repo.findByEmail(loginInfo.providerKey)

}
