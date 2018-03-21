package security

import scala.concurrent.ExecutionContext.Implicits.global
import javax.inject.Inject
import play.api.Configuration
import security.rules._
import v1.node.NodeRepo
import v1.project.ProjectRepo
import v1.user.{User, UserRepo}

trait SecurityRules {
    def checkRules(user: Option[User], rules: Seq[SecurityRule]): Unit
}

case class SecurityRulesService @Inject()(
    config: Configuration,
    userRepo: UserRepo,
    nodeRepo: NodeRepo,
    projectRepo: ProjectRepo
) extends SecurityRules {

    def checkProjectOwner(user: User, hash: String): Unit = {
        // todo
    }

    def checkNodeOwner(user: User, nodeId: Long): Unit = {
        // todo
    }

    def checkNotChildNode(nodeId: Long, targetId: Long): Unit = {
        for {
            Some(node) <- nodeRepo.findById(targetId)
            path       <- nodeRepo.pathToRoot(node)
        } yield {
            if (path.contains(nodeId)) {
                throw NotAllowedException()
            }
        }
    }

    def checkRules(user: Option[User], rules: Seq[SecurityRule]): Unit = {
        user match {
            case Some(user: User) => rules.foreach({
                case ProjectOwner(hash: String) => checkProjectOwner(user, hash)
                case NodeOwner(nodeId: Long) => checkNodeOwner(user, nodeId)
                case NotChildNode(nodeId: Long, targetId: Long) => checkNotChildNode(nodeId, targetId)
            })
            case _ => throw SecurityException()
        }
    }

}
