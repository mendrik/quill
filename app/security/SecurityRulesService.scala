package security

import com.mohiva.play.silhouette.impl.exceptions.IdentityNotFoundException
import javax.inject.Inject
import play.api.Configuration
import security.rules.{NodeOwner, ProjectOwner, SecurityException, SecurityRule}
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

    def checkRules(user: Option[User], rules: Seq[SecurityRule]): Unit = {
        user match {
            case Some(user: User) => rules.foreach({
                case ProjectOwner(hash: String) => checkProjectOwner(user, hash)
                case NodeOwner(nodeId: Long) => checkNodeOwner(user, nodeId)
            })
            case _ => throw SecurityException()
        }
    }

}
