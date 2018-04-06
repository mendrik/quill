package v1.node

import database.Tables._
import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.PostgresProfile
import slick.jdbc.PostgresProfile.api._
import v1.project.{Project, ProjectRepo}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.language.implicitConversions

@Singleton
class NodeRepo @Inject()(
    dcp: DatabaseConfigProvider,
    projectRepo: ProjectRepo,
    confRepo: NodeConfigRepo,
) {

    def pathToRoot(parent: Node): Future[Seq[Long]] = db.run {
        val id = parent.id.toString
        val sql = sql"""
        WITH RECURSIVE res AS (
            (SELECT id, parent FROM nodes WHERE id = #$id)
        UNION ALL
            (SELECT ct.id, ct.parent FROM res r JOIN nodes ct ON r.parent = ct.id)
        )
        SELECT id FROM res
        """
        sql.as[Long]
    }

    private val dbConfig = dcp.get[PostgresProfile]
    private val db = dbConfig.db

    def findById(id: Long): Future[Option[Node]] = {
        for {
            node <- db.run(Nodes.filter(_.id === id).result.headOption.map(_.map(toNode)))
            conf <- confRepo.findByNodeId(id)
        } yield {
            node.map(n => n.copy(nodeType = conf.map(c => c.nodeType).getOrElse(EmptyType)))
        }
    }

    def findByProject(project: Long): Future[Seq[Node]] = {
        for {
            nodes   <- db.run(Nodes.filter(_.project === project).sortBy(_.sort.asc).result)
            nodeIds <- Future.successful(nodes.map(_.id))
            configs <- db.run(NodeConfigs.filter(_.node inSet nodeIds).result)
        } yield {
            toTree(None, nodes, configs)
        }
    }

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
                    sort.map(_ + 1).getOrElse(0)
                )
        }).flatMap(findById)

    def update(project: Project, node: Node, parent: Option[Node]): Future[Int] =
        db.run(Nodes.filter(_.id === node.id)
            .map(n => (n.name, n.parent, n.project))
            .update((node.name, parent.map(_.id), project.id)))

    def remove(id: Long): Future[Int] =
        db.run(Nodes.filter(_.id === id).delete)

    def rename(id: Long, name: String): Future[Int] =
        db.run(Nodes.filter(_.id === id)
            .map(n => n.name)
            .update(name))

    def toNodes(row: Seq[NodesRow]): List[Node] = row.map(toNode).toList

    def toNode(row: NodesRow): Node = {
        Node(row.id, row.project, row.name, EmptyType, Nil)
    }

    def findType(nr: NodesRow, configs: Seq[NodeConfigsRow]): NodeType = {
        import v1.NodeIO._
        configs
            .find(conf => nr.id == conf.node)
            .map(conf => nodeTypeFromString(conf.nodeType))
            .getOrElse(StringType)
    }

    def toTree(parent: Option[NodesRow], nodes: Seq[NodesRow], configs: Seq[NodeConfigsRow]): List[Node] = {
        nodes.filter(n => parent.isEmpty   && n.parent.isEmpty ||
                          parent.isDefined && n.parent.contains(parent.map(_.id).get))
            .map(nr => toNode(nr).copy(nodeType = findType(nr, configs),children = toTree(Some(nr), nodes, configs))).toList
    }

}

