package v1.project

import v1.generic.Entity
import v1.node.Node
import v1.version.Version

case class Project(
    id: Long,
    name: Option[String],
    structure: Seq[Node],
    schema: Seq[Node],
    versions: Seq[Version]
) extends Entity
