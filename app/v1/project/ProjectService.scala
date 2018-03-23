package v1.project

import javax.inject._
import com.mohiva.play.silhouette.impl.exceptions.AccessDeniedException
import com.mohiva.play.silhouette.impl.providers.OAuth1Provider.AuthorizationError
import utils.Implicits._
import v1.project_user.ProjectUserRepo
import v1.user.{User, UserRepo}
import scalaz.Scalaz._
import v1.generic.extensions.decodeHash

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ProjectService @Inject()(
    uRepo: UserRepo,
    repo: ProjectRepo,
    puRepo: ProjectUserRepo
) {
    def createProject(user: User): Future[Project] = {
        for {
            Some(project) <- repo.createProject(Project(0, None, Nil, Nil))
            _ <- puRepo.createProjectUser(user, project)
            _ <- uRepo.update(user.copy(lastProject = Some(project.id)))
        } yield {
            project
        }
    }

    def getProject(user: User): Future[Project] = {
        (for {
            Some(project) <- repo.find(user).map(_.headOption)
        } yield {
            project
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
