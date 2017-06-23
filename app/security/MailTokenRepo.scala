package security

import javax.inject.{Inject, Singleton}

import database.Tables._
import database._
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.MySQLProfile
import slick.jdbc.MySQLProfile.api._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class MailTokenRepo @Inject()(dcp: DatabaseConfigProvider) {

    private val dbConfig = dcp.get[MySQLProfile]
    private val db = dbConfig.db

    def findById(id: String): Future[Option[MailTokenUser]] =
        db.run(MailTokens.filter(_.id === id).result.map(_.headOption.map(toMailTokenUser)))

    def createMailToken(token: MailTokenUser): Future[Option[MailTokenUser]] =
        db.run(MailTokens += token).flatMap(_ => findById(token.id))

    def remove(id: String) =
        db.run(MailTokens.filter(_.id === id).delete).map(_ => ())

    def toMailTokenUser(tokenRow: MailTokensRow): MailTokenUser =
        MailTokenUser(tokenRow.id, tokenRow.email, tokenRow.expirationTime)

    implicit def toMailTokensRow(token: MailTokenUser): MailTokensRow =
        MailTokensRow(token.id, token.email, token.expirationTime)


}

