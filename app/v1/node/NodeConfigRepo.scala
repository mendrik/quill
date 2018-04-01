package v1.node

import database.Tables._
import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.PostgresProfile
import slick.jdbc.PostgresProfile.api._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import v1.NodeIO._

@Singleton
class NodeConfigRepo @Inject()(
    dcp: DatabaseConfigProvider
) {

    private val dbConfig = dcp.get[PostgresProfile]
    private val db = dbConfig.db

    def findById(id: Long): Future[Option[NodeConfig]] = db.run {
        NodeConfigs.filter(_.id === id).result
            .headOption.map(_.map(toNodeConfig))
    }

    def findByNodeId(nodeId: Long): Future[Option[NodeConfig]] = db.run {
        NodeConfigs.filter(_.node === nodeId).result
            .headOption.map(_.map(toNodeConfig))
    }

    def createNodeConfig(conf: NodeConfig): Future[Option[NodeConfig]] =
        db.run(NodeConfigs returning NodeConfigs.map(_.id) += toNodeConfigRow(conf))
            .flatMap(findById)

    def toNodeConfig(row: NodeConfigsRow): NodeConfig = {
        NodeConfig(
            row.id,
            row.node,
            row.nodeType,
            NodeConfigString(row.stringValidation),
            NodeConfigMultiline(row.multilineEditor),
            NodeConfigNumber(row.numberMin, row.numberMax, row.numberEditor),
            NodeConfigFraction(row.fractionFormat),
            NodeConfigDate(row.dateFormat),
            NodeConfigDatetime(row.datetimeFormat),
            NodeConfigBoolean(row.booleanEdtitor),
            NodeConfigEnum(Nil),
            NodeConfigList(row.listFilter)
        )
    }

    def toNodeConfigRow(n: NodeConfig): NodeConfigsRow = {
        NodeConfigsRow(
            n.id,
            n.node,
            n.nodeType,
            n.string.validation,
            n.multiline.editor,
            n.number.min,
            n.number.max,
            n.number.editor,
            n.fraction.format,
            n.date.format,
            n.datetime.format,
            n.boolean.editor,
            n.list.filter
        )
    }
}

