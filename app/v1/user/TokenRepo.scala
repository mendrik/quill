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

@Singleton
class TokenRepo @Inject()(dcp: DatabaseConfigProvider) {

    private val dbConfig = dcp.get[MySQLProfile]
    private val db = dbConfig.db

    def findById(id: String): Future[Option[Token]] = {
        db.run(Tokens.filter(_.id === id).result.map(_.headOption.map(toToken)))
    }

    def createToken(token: Token): Future[Option[Token]] =
        db.run(Tokens returning Tokens.map(_.id) += token).flatMap(findById)

    def update(token: Token) =
        Tokens.filter(_.id === token.id)
            .map(u => u.lastUsed)
            .update(token.lastUsed)

    def remove(id: String) = {
        db.run(Tokens.filter(_.id === id).delete).map(_ => ())
    }

    def toToken(tokenRow: TokensRow): Token =
        Token(tokenRow.id, tokenRow.user, tokenRow.lastUsed)

    implicit def toTokensRow(token: Token): TokensRow =
        TokensRow(token.id, token.user, token.lastUsed)

}

