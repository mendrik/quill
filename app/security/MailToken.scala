package security

import java.util.UUID

import org.joda.time.DateTime

trait MailToken {
    def id: String
    def email: String
    def expirationTime: DateTime
    def isExpired = expirationTime.isBeforeNow
}

case class MailTokenUser(id: String, email: String, expirationTime: DateTime) extends MailToken

object MailTokenUser {
    def apply(email: String): MailTokenUser =
        MailTokenUser(UUID.randomUUID().toString, email, DateTime.now().plusHours(24))
}

