package v1.node

import v1.generic.Entity
import v1.project.Project

sealed trait NodeType
case object BoolType extends NodeType
case object NumberType extends NodeType
case object StringType extends NodeType
case object DateType extends NodeType
case object NodeType extends NodeType
case object ListType extends NodeType

case class Node(
    id: Long,
    name: String,
    nodeType: NodeType,
    children: Seq[Node]
) extends Entity

