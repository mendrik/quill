package utils

import java.sql.Timestamp

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.api.util.PasswordInfo
import com.mohiva.play.silhouette.impl.providers.CredentialsProvider
import com.mohiva.play.silhouette.password.BCryptPasswordHasher
import org.joda.time.DateTime
import play.api.mvc.Result

import scala.concurrent.Future

object Implicits {
    implicit def key2loginInfo(key: String): LoginInfo = LoginInfo(CredentialsProvider.ID, key)
    implicit def loginInfo2key(loginInfo: LoginInfo): String = loginInfo.providerKey
    implicit def pwd2passwordInfo(pwd: String): PasswordInfo = PasswordInfo(BCryptPasswordHasher.ID, pwd, salt = Some("$2y$10$S"))
    implicit def passwordInfo2pwd(passwordInfo: PasswordInfo): String = passwordInfo.password

    implicit def toDatetime(timestamp: Timestamp): DateTime = new DateTime(timestamp.getTime)
    implicit def toTimestamp(datetime: DateTime): Timestamp = new Timestamp(datetime.getMillis)

    implicit def toFuture(status: Result): Future[Result] = Future.successful(status)
}
