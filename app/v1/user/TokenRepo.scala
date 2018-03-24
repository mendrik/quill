package v1.token

import javax.inject.{Inject, Singleton}

import database.Tables._
import utils.Implicits._
import play.api.db.slick.DatabaseConfigProvider
import security.Token
import slick.jdbc.PostgresProfile
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class TokenRepo @Inject()(dcp: DatabaseConfigProvider) {

    private val dbConfig = dcp.get[PostgresProfile]
    private val db = dbConfig.db

    def findById(id: String): Future[Option[Token]] =
        db.run(Tokens.filter(_.id === id).result.map(_.headOption.map(toToken)))

    def createToken(token: Token): Future[Option[Token]] =
        db.run(Tokens += token).flatMap(_ => findById(token.id))

    def update(token: Token) =
        Tokens.filter(_.id === token.id)
            .map(u => (u.lastUsed, u.expiration))
            .update((token.lastUsed, token.expiration))

    def remove(id: String) =
        db.run(Tokens.filter(_.id === id).delete).map(_ => ())

    def toToken(tokenRow: TokensRow): Token =
        Token(tokenRow.id, tokenRow.user, tokenRow.lastUsed, tokenRow.expiration)

    implicit def toTokensRow(token: Token): TokensRow =
        TokensRow(token.id, token.user, token.lastUsed, token.expiration)


}

