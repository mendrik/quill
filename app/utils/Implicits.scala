package utils

import java.sql.Timestamp

import com.mohiva.play.silhouette.api.LoginInfo
import com.mohiva.play.silhouette.api.util.PasswordInfo
import com.mohiva.play.silhouette.impl.providers.CredentialsProvider
import com.mohiva.play.silhouette.password.BCryptPasswordHasher
import org.joda.time.DateTime
import play.api.libs.json._
import play.api.mvc.Result

import scala.concurrent.Future

object Implicits {
    implicit def key2loginInfo(key: String): LoginInfo = LoginInfo(CredentialsProvider.ID, key)
    implicit def loginInfo2key(loginInfo: LoginInfo): String = loginInfo.providerKey
    implicit def pwd2passwordInfo(pwd: String): PasswordInfo = PasswordInfo(BCryptPasswordHasher.ID, pwd, salt = Some("$2y$10$S"))
    implicit def passwordInfo2pwd(passwordInfo: PasswordInfo): String = passwordInfo.password

    implicit def toDatetime(timestamp: Timestamp): DateTime = new DateTime(timestamp.getTime)
    implicit def toOptionalLocalDatetime(timestamp: Option[Timestamp]): Option[DateTime] = timestamp.map(toDatetime)
    implicit def toTimestamp(datetime: DateTime): Timestamp = new Timestamp(datetime.getMillis)

    implicit def toFuture(status: Result): Future[Result] = Future.successful(status)

    val pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    implicit val dateFormat = Format[DateTime](JodaReads.jodaDateReads(pattern), JodaWrites.jodaDateWrites(pattern))
}

