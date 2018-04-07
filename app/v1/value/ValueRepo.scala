package v1.value

import database.Tables._
import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.PostgresProfile
import slick.jdbc.PostgresProfile.api._
import v1.node.{Node, NodeConfig, StringType}
import v1.version.Version
import utils.Implicits._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class ValueRepo @Inject()(dcp: DatabaseConfigProvider) {

    private val dbConfig = dcp.get[PostgresProfile]
    private val db = dbConfig.db

    def findById(id: Long): Future[Option[Value]] =
        db.run(NodeValues.filter(_.id === id).result.headOption.map(_.map(toValue)))

    def findByVersion(id: Long): Future[Seq[Value]] =
        db.run(NodeValues.filter(_.version === id).result.map(_.map(toValue)))

    def createValue(value: Value, node: Node, version: Version): Future[Option[Value]] =
        db.run(NodeValues returning NodeValues.map(_.id)
            += toNodeValuesRow(value, node, version)).flatMap(findById)

    def update(value: Value): Future[Int] =
        db.run(NodeValues.filter(_.id === value.id)
            .map(v => v.node)
            .update(value.nodeId))

    def remove(value: Value): Future[Int] =
        db.run(NodeValues.filter(_.id === value.id).delete)

    def toValue(row: NodeValuesRow): Value =
        Value(
            row.id,
            row.version,
            row.node,
            row.arrValue,
            row.strValue,
            row.numValue,
            row.decimalValue,
            row.dateValue,
            row.boolValue,
            NodeConfig(0, row.node, StringType)
        )

    def toNodeValuesRow(value: Value, node: Node, version: Version): NodeValuesRow =
        NodeValuesRow(value.id, node.id, version.id, None, None, None, None)

}

