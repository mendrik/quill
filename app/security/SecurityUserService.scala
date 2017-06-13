package security

import com.mohiva.play.silhouette.api.services.IdentityService
import v1.user.User

trait SecurityUserService extends IdentityService[User] {

}
