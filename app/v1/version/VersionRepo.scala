package v1.version

import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.PostgresProfile
import slick.jdbc.PostgresProfile.api._
import v1.project.Project
import database.Tables._
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

@Singleton
class VersionRepo @Inject()(dcp: DatabaseConfigProvider) {

    private val dbConfig = dcp.get[PostgresProfile]
    private val db = dbConfig.db

    def findById(id: Long): Future[Option[Version]] =
        db.run(Versions.filter(_.id === id).result.headOption.map(_.map(toVersion)))

    def findByProjectId(projectId: Long): Future[Seq[Version]] =
        db.run(Versions.filter(_.project === projectId).result.map(_.map(toVersion)))

    def createVersion(version: Version, project: Project): Future[Option[Version]] =
        db.run(Versions returning Versions.map(_.id)
            += toVersionsRow(version, project)).flatMap(findById)

    def update(version: Version): Future[Int] =
        db.run(Versions.filter(_.id === version.id)
            .map(v => (v.name, v.icon))
            .update((version.name, version.icon)))

    def remove(version: Version): Future[Int] =
        db.run(Versions.filter(_.id === version.id).delete)

    def toVersion(row: VersionsRow): Version =
        Version(row.id, row.project, row.name, row.icon)

    def toVersionsRow(version: Version, project: Project): VersionsRow =
        VersionsRow(version.id, version.name, project.id, version.icon)

}

