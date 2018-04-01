package v1.node

import javax.inject._
import json.readConf
import play.api.Configuration
import v1.NodeIO._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class NodeService @Inject()(
  conf: Configuration,
  repo: NodeRepo,
  configRepo: NodeConfigRepo,
  enumRepo: NodeConfigEnumRepo
) {
    val getDefaultNodeConfig: Future[NodeConfig] = Future.successful {
        readConf[NodeConfig](conf, "nodeConfig")
    }

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

    def getNodeConfigByNodeId(nodeId: Long): Future[NodeConfig] =
        (for {
            Some(conf) <- configRepo.findByNodeId(nodeId)
            conf <- enhance(conf)
        } yield {
            conf
        })
        .fallbackTo(getDefaultNodeConfig)

    def isChildNode(nodeId: Long, parentId: Long): Future[Boolean] = {
        for {
            Some(node: Node)   <- repo.findById(nodeId)
            Some(parent: Node) <- repo.findById(parentId)
            nodes              <- repo.pathToRoot(parent)
        } yield nodes.contains(nodeId)
    }

    def enhance(conf: NodeConfig): Future[NodeConfig] = {
        for {
            enums <- enumRepo.findByConfigId(conf.id)
        } yield {
            conf.copy(enum = NodeConfigEnum(enums))
        }
    }
}
