package v1.project

import javax.inject._

import v1.project_user.ProjectUserRepo
import v1.user.{User, UserRepo}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ProjectService @Inject()(
    uRepo: UserRepo,
    repo: ProjectRepo,
    puRepo: ProjectUserRepo
) {

    def createProject(user: User): Future[Project] = {
        for {
            Some(project) <- repo.createProject(Project(0, None))
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
}
