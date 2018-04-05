package v1.version

import javax.inject._
import v1.value.ValueRepo
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class VersionService @Inject()(
    versionRepo: VersionRepo,
    valueRepo: ValueRepo
) () {

    def getById(id: Long): Future[Version] = {
        for {
            Some(version) <- versionRepo.findById(id)
            values <- valueRepo.findByVersion(id)
        } yield {
            version.copy(values = values)
        }
    }

}
