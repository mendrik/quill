package security.rules

trait SecurityRule
case class ProjectOwner(hash: String) extends SecurityRule
case class NodeOwner(nodeId: Long) extends SecurityRule
