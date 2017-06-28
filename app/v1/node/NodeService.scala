package v1.node

import javax.inject._

import v1.project.Project

class NodeService @Inject()(repo: NodeRepo) {

    def createNode(project: Long, node: Node, parent: Option[Long]) =
        repo.createNode(project, node, parent)

    def rootNodes(project: Project): Seq[Node] = {
        Nil
    }

    def schemaNodes(project: Project): Seq[Node] = {
        Nil
    }

}
