package v1.node

import javax.inject._
import play.api.Configuration

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class NodeService @Inject()(
  conf: Configuration,
  repo: NodeRepo,
  configRepo: NodeConfigRepo,
  enumRepo: NodeConfigEnumRepo
) {

    def moveNode(nodeId: Long, move: MoveNode): Future[Unit] = Future.successful(())

    def createNode(node: Node, parent: Option[Long]): Future[Option[Node]] =
        repo.createNode(node, parent)

    def deleteNode(nodeId: Long): Future[Int] =
        repo.remove(nodeId)

    def renameNode(nodeId: Long, name: String): Future[Int] =
        repo.rename(nodeId, name)

    def structureNodes(project: Long): Future[Seq[Node]] =
        repo.findByProject(project)

    def byId(nodeId: Long): Future[Option[Node]] = repo.findById(nodeId)

    def createNodeConfig(nodeId: Long): Future[NodeConfig] = {
        for (
            Some(conf) <- configRepo.createNodeConfig(
                nodeId,
                NodeConfig(
                    0,
                    StringType,
                    NodeConfigString(None),
                    NodeConfigMultiline(Normal),
                    NodeConfigNumber(None, None, NumberInput),
                    NodeConfigFraction(None),
                    NodeConfigDate(None),
                    NodeConfigDatetime(None),
                    NodeConfigBoolean(Switch),
                    NodeConfigEnum(Nil),
                    NodeConfigList(None)
               )
            )
        ) yield conf
    }

    def updateNodeConfig(conf: NodeConfig): Future[NodeConfig] = {
        for {
            _ <- configRepo.update(conf)
            _ <- enumRepo.deleteByConfId(conf.id)
            _ <- enumRepo.insertAll(conf.enum)
        } yield {
            conf
        }
    }

    def nodeConfigByNodeId(nodeId: Long): Future[NodeConfig] =
        (for {
            Some(conf) <- configRepo.findByNodeId(nodeId)
            conf       <- enhance(conf)
        } yield {
            conf
        })
        .fallbackTo(createNodeConfig(nodeId))

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
