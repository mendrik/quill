package security

import com.mohiva.play.silhouette.api.services.IdentityService
import v1.user.UserModel

trait SecurityUserService extends IdentityService[UserModel] {

}
