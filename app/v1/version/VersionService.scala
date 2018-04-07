package v1.version

import javax.inject._
import v1.node._
import v1.value.ValueRepo

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class VersionService @Inject()(
    versionRepo: VersionRepo,
    valueRepo: ValueRepo,
    confRepo: NodeConfigRepo
) () {

    def defaultConfig(nodeId: Long): NodeConfig = NodeConfig(0, nodeId, StringType)

    def getById(id: Long): Future[Version] = {
        for {
            Some(version) <- versionRepo.findById(id)
            values        <- valueRepo.findByVersion(id)
            configs       <- confRepo.findByVersionId(id)
        } yield {
            version.copy(values = values.map(v => v
                .copy(config =
                    configs
                        .find(_.nodeId == v.nodeId)
                        .getOrElse(defaultConfig(v.nodeId))
                )
            ))
        }
    }
}
