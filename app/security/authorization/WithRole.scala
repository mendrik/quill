package security.authorization

import com.mohiva.play.silhouette.api.Authorization
import play.api.mvc.Request
import security.QuillEnv
import security.authorization.Roles.Role
import v1.user.User

import scala.concurrent.Future

/**
 * Grants access to a User with the given Role.
 *
 *  {{{
 *     silhouette.SecuredAction(WithRole(UserRole))
 *
 *     // You can also import an implicit ExecutionContext and then use operands: !, ||, &&
 *     silhouette.SecuredAction(WithRole(UserRole) || WithRole(AdminRole))
 *  }}}
 */
case class WithRole(role: Role) extends Authorization[User, QuillEnv#A] {

  override def isAuthorized[B](user: User, authenticator: QuillEnv#A)(implicit request: Request[B]): Future[Boolean] =
    //Future.successful(user.role == role)
    Future.successful(true)

}
