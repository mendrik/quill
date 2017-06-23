package security

import org.joda.time.DateTime

trait MailToken {
    def id: String
    def email: String
    def expirationTime: DateTime
    def isExpired = expirationTime.isBeforeNow
}

case class MailTokenUser(id: String, email: String, expirationTime: DateTime) extends MailToken

