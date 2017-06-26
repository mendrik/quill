package v1.project

import javax.inject._

import v1.project_user.ProjectUserRepo
import v1.user.User

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ProjectService @Inject()(
    repo: ProjectRepo,
    puRepo: ProjectUserRepo
) {

    def createProject(user: User): Future[Project] = {
        for {
            Some(project) <- repo.createProject(Project(0, None))
            _ <- puRepo.createProjectUser(user, project)
        } yield {
            project
        }
    }
}
