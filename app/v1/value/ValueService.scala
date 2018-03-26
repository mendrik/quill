package v1.value

import javax.inject._
import v1.node.NodeService
import v1.version.Version
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ValueService @Inject()(
   repo: ValueRepo,
   nodeService: NodeService
) {

    def getByVersion(version: Version): Future[Seq[Value]] = {
        for {
            values <- repo.findByVersion(version.id)
            nodes  <- nodeService.structureNodes(version.project)
        } yield {
            Nil
        }
    }

}
