package v1.node

import database.Tables._
import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.PostgresProfile.api._
import slick.jdbc.PostgresProfile
import v1.NodeIO._
import v1.project.{Project, ProjectRepo}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class NodeRepo @Inject()(
    dcp: DatabaseConfigProvider,
    projectRepo: ProjectRepo
) {

    def pathToRoot(parent: Node): Future[Seq[Long]] = db.run {
        val id = parent.id.toString
        sql"""
             | WITH RECURSIVE res AS (
             |    (SELECT id, parent FROM nodes WHERE id = '$id')
             |  UNION ALL
             |    (SELECT ct.id, ct.parent FROM res r JOIN nodes ct ON r.parent = ct.id)
             | )
             | SELECT id FROM res
           """.as[Long]
    }

    private val dbConfig = dcp.get[PostgresProfile]
    private val db = dbConfig.db

    def findById(id: Long): Future[Option[Node]] = db.run {
        Nodes.filter(_.id === id).result.headOption.map(_.map(toNode))
    }

    def findByProjectAndType(project: Long, nodeRoot: NodeRoot): Future[Seq[Node]] = db.run {
        Nodes
            .filter(p => p.project === project && p.nodeRoot === (nodeRoot: String))
            .sortBy(_.sort.asc)
            .result
    }.map(toTree(None, _))

    def getHighestSort(parent: Option[Long]): Future[Option[Int]] = db.run {
        val select = parent match {
            case Some(id) => Nodes.filter(n => n.parent === id)
            case None => Nodes.filter(n => n.parent.isEmpty)
        }
        select
        .sortBy(_.sort.desc)
        .take(1)
        .map(_.sort)
        .result
        .headOption
    }

    def createNode(node: Node, parent: Option[Long]): Future[Option[Node]] =
        getHighestSort(parent).flatMap(sort => db.run {
            Nodes returning Nodes.map(_.id) +=
                NodesRow(
                    node.id,
                    parent,
                    node.project,
                    node.name,
                    asString(node.nodeRoot),
                    asString(node.nodeType),
                    sort.map(_ + 1).getOrElse(0)
                )
        }).flatMap(findById)

    def update(project: Project, node: Node, parent: Option[Node]): Future[Int] =
        db.run(Nodes.filter(_.id === node.id)
            .map(n => (n.name, n.parent, n.project, n.nodeRoot, n.nodeType, n.sort))
            .update((node.name, parent.map(_.id), project.id, node.nodeRoot, node.nodeType, node.sort)))

    def remove(id: Long): Future[Int] =
        db.run(Nodes.filter(_.id === id).delete)

    def rename(id: Long, name: String): Future[Int] =
        db.run(Nodes.filter(_.id === id)
            .map(n => n.name)
            .update(name))

    def toNodes(row: Seq[NodesRow]): List[Node] = row.map(toNode).toList

    def toNode(row: NodesRow): Node = {
        Node(row.id, row.project, row.name, row.nodeRoot, row.nodeType, row.sort, Nil)
    }

    def toTree(parent: Option[NodesRow], nodes: Seq[NodesRow]): List[Node] = {
        nodes.filter(n => parent.isEmpty   && n.parent.isEmpty ||
                          parent.isDefined && n.parent.contains(parent.map(_.id).get))
            .map(nr => toNode(nr).copy(children = toTree(Some(nr), nodes))).toList
    }

}

