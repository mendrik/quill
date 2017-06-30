package v1.project

import javax.inject.{Inject, Singleton}

import database.Tables._
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.MySQLProfile
import slick.jdbc.MySQLProfile.api._
import v1.user.User

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class ProjectRepo @Inject()(dcp: DatabaseConfigProvider) {


    private val dbConfig = dcp.get[MySQLProfile]
    private val db = dbConfig.db

    def findById(id: Long): Future[Option[Project]] =
        db.run(Projects.filter(_.id === id).result.headOption.map(toProject))

    def find(user: User): Future[List[Project]] = {
        val projectJoin = ProjectUsers join Projects on (_.project === _.id)
        db.run(
            projectJoin
            .filter(_._1.user === user.id)
            .map(_._2).result
            .map(toProjects)
        )
    }

    def createProject(project: Project): Future[Option[Project]] =
        db.run(Projects returning Projects.map(_.id) += project).flatMap(findById)

    def update(project: Project) =
        db.run(Projects.filter(_.id === project.id)
            .map(p => p.name)
            .update(project.name))

    def remove(user: Project) =
        db.run(Projects.filter(_.id === user.id).delete)

    def toProject(row: ProjectsRow): Project = Project(row.id, row.name, Nil, Nil)

    def toProjects(row: Seq[ProjectsRow]): List[Project] = row.map(toProject).toList

    def toProject(row: Option[ProjectsRow]): Option[Project] = row.map(toProject)

    implicit def toProjectsRow(p: Project): ProjectsRow =
        ProjectsRow(p.id, p.name)


}

