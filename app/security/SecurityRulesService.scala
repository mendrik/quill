package security

import javax.inject.Inject
import play.api.Configuration
import security.rules.{NodeOwner, ProjectOwner, SecurityRule}
import v1.node.NodeRepo
import v1.project.ProjectRepo
import v1.user.UserRepo

trait SecurityRules {
    def checkRules(rules: Seq[SecurityRule]): Unit
}

case class SecurityRulesService @Inject()(
    config: Configuration,
    userRepo: UserRepo,
    nodeRepo: NodeRepo,
    projectRepo: ProjectRepo
) extends SecurityRules {

    def checkProjectOwner(hash: String): Unit = {
    }

    def checkNodeOwner(nodeId: Long): Unit = {

    }

    def checkRules(rules: Seq[SecurityRule]): Unit = {
        rules.foreach({
            case ProjectOwner(hash: String) => checkProjectOwner(hash)
            case NodeOwner(nodeId: Long) => checkNodeOwner(nodeId)
        })
    }

}
