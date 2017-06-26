package v1.node

import javax.inject.{Inject, Singleton}

import database.Tables._
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.MySQLProfile
import slick.jdbc.MySQLProfile.api._
import v1.project.{Project, ProjectRepo}
import v1.NodeIO._
import v1.version.Version

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import v1.NodeIO._

@Singleton
class NodeRepo @Inject()(
    dcp: DatabaseConfigProvider,
    projectRepo: ProjectRepo
) {

    private val dbConfig = dcp.get[MySQLProfile]
    private val db = dbConfig.db

    def findById(id: Long): Future[Option[Node]] = db.run {
        Nodes.filter(_.id === id).result.headOption.map(_.map(toNode))
    }

    def createNode(node: Node, parent: Option[Node], version: Version, project: Project): Future[Option[Node]] =
        db.run(Nodes returning Nodes.map(_.id) += NodesRow(
            node.id,
            parent.map(_.id),
            project.id,
            node.name,
            node.nodeType.toString
        )).flatMap(findById)

    def update(node: Node) =
        db.run(Nodes.filter(_.id === node.id)
            .map(v => v.name)
            .update(node.name))

    def remove(node: Node) =
        db.run(Nodes.filter(_.id === node.id).delete)

    def toNode(row: NodesRow): Node = {
        Node(row.id, row.name, row.nodeType, Nil)
    }

}

