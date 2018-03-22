package security

import scala.concurrent.ExecutionContext.Implicits.global
import javax.inject.Inject
import play.api.Configuration
import security.rules._
import v1.node.NodeRepo
import v1.project.ProjectRepo
import v1.user.{User, UserRepo}

import scala.concurrent.Future
import scala.concurrent.Future.sequence

trait SecurityRules {
    def checkRules(user: Option[User], rules: SecurityRule*): Future[Boolean]
}

case class SecurityRulesService @Inject()(
    config: Configuration,
    userRepo: UserRepo,
    nodeRepo: NodeRepo,
    projectRepo: ProjectRepo
) extends SecurityRules {

    def checkProjectOwner(user: User, hash: String): Future[Boolean] = {
        Future.successful(true)
    }

    def checkNodeOwner(user: User, nodeId: Long): Future[Boolean] = {
        Future.successful(true)
    }

    def checkNotChildNode(nodeId: Long, targetId: Long): Future[Boolean] = {
        for {
            Some(node) <- nodeRepo.findById(targetId)
            path       <- nodeRepo.pathToRoot(node)
        } yield {
            if (path.contains(nodeId)) {
                throw NotAllowedException()
            }
            true
        }
    }

    def checkRules(user: Option[User], rules: SecurityRule*): Future[Boolean] = {
        val res = user match {
            case Some(user: User) => sequence(rules.map {
                case ProjectOwner(hash: String) => checkProjectOwner(user, hash)
                case NodeOwner(nodeId: Long) => checkNodeOwner(user, nodeId)
                case NotChildNode(nodeId: Long, targetId: Long) => checkNotChildNode(nodeId, targetId)
            })
            case _ => throw SecurityException()
        }
        res.map(_.forall(identity))
    }
}
