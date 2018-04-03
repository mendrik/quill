package v1.node

import database.Tables._
import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.PostgresProfile
import slick.jdbc.PostgresProfile.api._
import v1.NodeIO._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

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

    def createNodeConfig(nodeId: Long, conf: NodeConfig): Future[Option[NodeConfig]] =
        db.run(NodeConfigs returning NodeConfigs.map(_.id) += toNodeConfigRow(nodeId, conf))
            .flatMap(findById)

    def update(conf: NodeConfig): Future[Int] = db.run {
        NodeConfigs
            .filter(_.id === conf.id)
            .map(p => (
                p.nodeType,
                p.stringValidation,
                p.multilineEditor,
                p.numberMin,
                p.numberMax,
                p.numberEditor,
                p.fractionFormat,
                p.dateFormat,
                p.datetimeFormat,
                p.booleanEdtitor,
                p.listFilter
            ))
            .update((
                conf.nodeType,
                conf.string.validation,
                conf.multiline.editor,
                conf.number.min,
                conf.number.max,
                conf.number.editor,
                conf.fraction.format,
                conf.date.format,
                conf.datetime.format,
                conf.boolean.editor,
                conf.list.filter
            ))
    }


    def toNodeConfig(row: NodeConfigsRow): NodeConfig = {
        NodeConfig(
            row.id,
            row.nodeType,
            NodeConfigString(row.stringValidation),
            NodeConfigMultiline(row.multilineEditor),
            NodeConfigNumber(
                row.numberMin,
                row.numberMax,
                row.numberEditor),
            NodeConfigFraction(row.fractionFormat),
            NodeConfigDate(row.dateFormat),
            NodeConfigDatetime(row.datetimeFormat),
            NodeConfigBoolean(row.booleanEdtitor),
            NodeConfigEnum(Nil),
            NodeConfigList(row.listFilter)
        )
    }

    def toNodeConfigRow(nodeId: Long, n: NodeConfig): NodeConfigsRow = {
        NodeConfigsRow(
            n.id,
            nodeId,
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

