package v1.node

import javax.inject._

import v1.project.Project

import scala.concurrent.Future

class NodeService @Inject()(repo: NodeRepo) {

    def createNode(project: Long, node: Node, parent: Option[Long]) =
        repo.createNode(project, node, parent)

    def deleteNode(project: String, nodeId: Long) = // todo check node belongs to project
        repo.remove(nodeId)

    def structureNodes(project: Long): Future[Seq[Node]] =
        repo.findByProjectAndType(project, Structure)

    def schemaNodes(project: Long): Future[Seq[Node]] =
        repo.findByProjectAndType(project, Schema)
}
