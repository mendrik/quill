package v1.project

import javax.inject._
import v1.generic.extensions.decodeHash
import v1.project_user.ProjectUserRepo
import v1.user.{User, UserRepo}
import v1.version.{Version, VersionRepo}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ProjectService @Inject()(
    uRepo: UserRepo,
    repo: ProjectRepo,
    versionRepo: VersionRepo,
    puRepo: ProjectUserRepo
) {
    def createProject(user: User): Future[Project] = {
        for {
            Some(project) <- repo.createProject(Project(0, None, Nil, Nil, Nil))
            Some(version) <- versionRepo.createVersion(Version(0, project.id, "Default"), project)
            _ <- puRepo.createProjectUser(user, project)
            _ <- uRepo.update(user.copy(lastProject = Some(project.id)))
        } yield {
            project.copy(versions = Seq(version))
        }
    }

    def getProject(user: User): Future[Project] = {
        (for {
            Some(project) <- repo.find(user).map(_.headOption)
            versions <- versionRepo.findByProjectId(project.id)
        } yield {
            project.copy(versions = versions)
        })
        .fallbackTo(createProject(user))
    }

    def userInProject(user: Long, project: Long): Future[Boolean] = {
        puRepo.find(user, project).map(_.isDefined)
    }

    def findByHashAndUser(hash: String, user: Long): Future[Project] = {
        val Some(id) = decodeHash(hash)
        for {
            ok            <- userInProject(user, id)
            Some(project) <- repo.findById(id) if ok
        } yield {
            project
        }
    }
}
