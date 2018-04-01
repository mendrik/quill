package v1.node

import database.Tables._
import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.PostgresProfile
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.language.implicitConversions

@Singleton
class NodeConfigEnumRepo @Inject()(
    dcp: DatabaseConfigProvider
) {

    private val dbConfig = dcp.get[PostgresProfile]
    private val db = dbConfig.db

    def findByConfigId(id: Long): Future[Seq[String]] = db.run {
        NodeConfigEnums.filter(_.nodeConfig === id).result
            .map(_.map(_.enumItem))
    }
}

