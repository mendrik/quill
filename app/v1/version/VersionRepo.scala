package v1.version

import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.PostgresProfile
import slick.jdbc.PostgresProfile.api._
import v1.project.Project
import database.Tables._
import scala.concurrent.Future

@Singleton
class VersionRepo @Inject()(dcp: DatabaseConfigProvider) {

    private val dbConfig = dcp.get[PostgresProfile]
    private val db = dbConfig.db

    def findById(id: Long): Future[Option[Version]] =
        db.run(Versions.filter(_.id === id).result.headOption.map(_.map(toVersion)))

    def createVersion(version: Version, project: Project): Future[Option[Version]] =
        db.run(Versions returning Versions.map(_.id) += toVersionsRow(version, project)).flatMap(findById)

    def update(version: Version) =
        db.run(Versions.filter(_.id === version.id)
            .map(v => v.name)
            .update(version.name))

    def remove(version: Version) =
        db.run(Versions.filter(_.id === version.id).delete)

    def toVersion(row: VersionsRow): Version =
        Version(row.id, row.name)

    def toVersionsRow(version: Version, project: Project): VersionsRow =
        VersionsRow(version.id, version.name, project.id)

}

