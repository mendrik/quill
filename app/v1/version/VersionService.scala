package v1.version

import javax.inject._

import scala.concurrent.Future

class VersionService @Inject()(
    versionRepo: VersionRepo
) () {

    def getById(id: Long): Future[Option[Version]] = versionRepo.findById(id)

}
