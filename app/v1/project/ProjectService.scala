package v1.project

import javax.inject._
import v1.generic.extensions.decodeHash
import v1.node.NodeService
import v1.project_user.ProjectUserRepo
import v1.user.{User, UserRepo}
import v1.version.{Version, VersionRepo}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ProjectService @Inject()(
    uRepo: UserRepo,
    repo: ProjectRepo,
    nodeService: NodeService,
    versionRepo: VersionRepo,
    puRepo: ProjectUserRepo
) {
    val newProject = Project(0, None, None, Nil, Nil)

    def createProject(user: User): Future[Project] = {
        for {
            Some(project) <- repo.createProject(newProject)
            Some(version) <- versionRepo.createVersion(Version(0, project.id, "Default", "book"), project)
            _             <- puRepo.createProjectUser(user, project)
            _             <- uRepo.update(user.copy(lastProject = Some(project.id)))
        } yield {
            project.copy(versions = Seq(version))
        }
    }

    def getProject(user: User): Future[Project] = {
        (for {
            Some(stub) <- repo.find(user).map(_.headOption)
            project    <- enhance(stub)
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
            ok         <- userInProject(user, id)
            Some(stub) <- repo.findById(id) if ok
            project    <- enhance(stub)
        } yield {
            project
        }
    }

    def enhance(project: Project): Future[Project] = {
        for {
            versions <- versionRepo.findByProjectId(project.id)
            structure <- nodeService.structureNodes(project.id)
        } yield {
            project.copy(versions = versions, structure = structure)
        }
    }
}
