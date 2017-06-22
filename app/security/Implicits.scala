package security

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.api.util.PasswordInfo
import com.mohiva.play.silhouette.impl.providers.CredentialsProvider
import com.mohiva.play.silhouette.password.BCryptPasswordHasher

object Implicits {
    implicit def key2loginInfo(key: String): LoginInfo = LoginInfo(CredentialsProvider.ID, key)
    implicit def loginInfo2key(loginInfo: LoginInfo): String = loginInfo.providerKey
    implicit def pwd2passwordInfo(pwd: String): PasswordInfo = PasswordInfo(BCryptPasswordHasher.ID, pwd, salt = Some("$2y$10$S.rm6PCw8/Xtr7SRlgBXKOtOtA.ZDRIBa76ZcBkJA4dh/yLNRMQzy"))
    implicit def passwordInfo2pwd(passwordInfo: PasswordInfo): String = passwordInfo.password
}
