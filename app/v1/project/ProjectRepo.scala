package v1.project

import javax.inject.{Inject, Singleton}

import database.Tables._
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.MySQLProfile
import slick.jdbc.MySQLProfile.api._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class ProjectRepo @Inject()(dcp: DatabaseConfigProvider) {

    private val dbConfig = dcp.get[MySQLProfile]
    private val db = dbConfig.db

    def findById(id: Long): Future[Option[Project]] =
        db.run(Projects.filter(_.id === id).result.headOption.map(_.map(toProject)))

    def createProject(project: Project): Future[Option[Project]] =
        db.run(Projects returning Projects.map(_.id) += project).flatMap(findById)

    def update(project: Project) =
        db.run(Projects.filter(_.id === project.id)
            .map(p => p.name)
            .update(project.name))

    def remove(user: Project) =
        db.run(Projects.filter(_.id === user.id).delete)

    def toProject(row: ProjectsRow): Project =
        Project(row.id, row.name)

    implicit def toProjectsRow(p: Project): ProjectsRow =
        ProjectsRow(p.id, p.name)


}

