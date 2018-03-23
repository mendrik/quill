package security.rules

trait SecurityRule
case class ProjectOwner(hash: String) extends SecurityRule
case class NodeOwner(nodeId: Int) extends SecurityRule
case class NotChildNode(nodeId: Int, targetId: Int) extends SecurityRule
