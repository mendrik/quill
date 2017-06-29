package v1.project

import v1.generic.Entity
import v1.node.Node

case class Project(
    id: Long,
    name: Option[String],
    structure: Seq[Node],
    schema: Seq[Node]
) extends Entity
