package security

import com.mohiva.play.silhouette.api.Env
import com.mohiva.play.silhouette.impl.authenticators.BearerTokenAuthenticator
import v1.user.User

trait QuillEnv extends Env {
  type I = User
  type A = BearerTokenAuthenticator
}
