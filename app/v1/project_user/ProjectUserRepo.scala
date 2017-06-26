package v1.project_user

import javax.inject.{Inject, Singleton}

import database.Tables._
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.MySQLProfile
import slick.jdbc.MySQLProfile.api._
import v1.project.Project
import v1.user.User

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

@Singleton
class ProjectUserRepo @Inject()(dcp: DatabaseConfigProvider) {

    private val dbConfig = dcp.get[MySQLProfile]
    private val db = dbConfig.db

    def find(user: User, project: Project): Future[Option[ProjectUser]] =
        db.run(ProjectUsers.filter(pu => pu.user === user.id && pu.project === project.id).result.headOption.map(_.map(toProjectUser)))

    def createProjectUser(user: User, project: Project): Future[Option[ProjectUser]] =
        db.run(ProjectUsers += toProjectUsersRow(user, project)).flatMap(x => find(user, project))

    def remove(user: User, project: Project) =
        db.run(ProjectUsers.filter(pu => pu.user === user.id && pu.project === project.id).delete)

    def toProjectUser(row: ProjectUsersRow): ProjectUser =
        ProjectUser(row.user, row.project)

    def toProjectUsersRow(user: User, project: Project): ProjectUsersRow =
        ProjectUsersRow(user.id, project.id)

}

