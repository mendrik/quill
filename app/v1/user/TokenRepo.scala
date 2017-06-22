package v1.token

import javax.inject.{Inject, Singleton}
import database.Tables._
import database._
import play.api.db.slick.DatabaseConfigProvider
import security.Token
import slick.jdbc.MySQLProfile
import slick.jdbc.MySQLProfile.api._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

@Singleton
class TokenRepo @Inject()(dcp: DatabaseConfigProvider) {

    private val dbConfig = dcp.get[MySQLProfile]
    private val db = dbConfig.db

    def findById(id: String): Future[Token] =
        db.run(Tokens.filter(_.id === id).result.head.map(toToken))

    def createToken(token: Token): Future[Token] =
        db.run(Tokens returning Tokens.map(_.id) += token).flatMap(findById)

    def update(token: Token) =
        Tokens.filter(_.id === token.id)
            .map(u => (u.lastUsed, u.expires))
            .update((token.lastUsed, token.expires))

    def remove(token: Token) =
        db.run(Tokens.filter(_.id === token.id).delete)

    def toToken(tokenRow: TokensRow): Token =
        Token(tokenRow.id, tokenRow.user, tokenRow.lastUsed, tokenRow.expires, 30 days)

    implicit def toTokensRow(token: Token): TokensRow =
        TokensRow(token.id, token.user, token.lastUsed, token.expires)

}

