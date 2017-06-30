package v1.node

import javax.inject._

import v1.project.Project

import scala.concurrent.Future

class NodeService @Inject()(repo: NodeRepo) {

    def createNode(project: Long, node: Node, parent: Option[Long]) =
        repo.createNode(project, node, parent)

    def getStructureNodes(project: Long): Future[List[Node]] = {
        repo.findByProjectAndType(project, Structure)
    }

    def schemaNodes(project: Project): Seq[Node] = {
        Nil
    }

}
