package v1.node

import javax.inject._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class NodeService @Inject()(repo: NodeRepo) {

    def moveNode(nodeId: Long, move: MoveNode) = Future.successful(())

    def createNode(node: Node, parent: Option[Long]) =
        repo.createNode(node, parent)

    def deleteNode(nodeId: Long) =
        repo.remove(nodeId)

    def renameNode(nodeId: Long, name: String) =
        repo.rename(nodeId, name)

    def structureNodes(project: Long): Future[Seq[Node]] =
        repo.findByProject(project)

    def byId(nodeId: Long): Future[Option[Node]] = repo.findById(nodeId)

    def isChildNode(nodeId: Long, parentId: Long): Future[Boolean] = {
        for {
            Some(node: Node)   <- repo.findById(nodeId)
            Some(parent: Node) <- repo.findById(parentId)
            nodes              <- repo.pathToRoot(parent)
        } yield nodes.contains(nodeId)
    }
}
