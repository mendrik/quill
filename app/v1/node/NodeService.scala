package v1.node

import javax.inject._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class NodeService @Inject()(repo: NodeRepo) {

    def moveNode(nodeId: Int, move: MoveNode) = Future.successful(())

    def createNode(node: Node, parent: Option[Int]) =
        repo.createNode(node, parent)

    def deleteNode(nodeId: Int) =
        repo.remove(nodeId)

    def renameNode(nodeId: Int, name: String) =
        repo.rename(nodeId, name)

    def structureNodes(project: Int): Future[Seq[Node]] =
        repo.findByProjectAndType(project, Structure)

    def byId(nodeId: Int): Future[Option[Node]] = repo.findById(nodeId)

    def schemaNodes(project: Int): Future[Seq[Node]] =
        repo.findByProjectAndType(project, Schema)

    def isChildNode(nodeId: Int, parentId: Int): Future[Boolean] = {
        for {
            Some(node: Node)   <- repo.findById(nodeId)
            Some(parent: Node) <- repo.findById(parentId)
            nodes              <- repo.pathToRoot(parent) if node.nodeRoot == parent.nodeRoot
        } yield nodes.contains(nodeId)
    }
}
