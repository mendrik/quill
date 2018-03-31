package v1.node

import v1.generic.Entity

sealed trait NodeType
case object BoolType extends NodeType
case object NumberType extends NodeType
case object FractionType extends NodeType
case object StringType extends NodeType
case object MultilineType extends NodeType
case object EnumType extends NodeType
case object DateType extends NodeType
case object DatetimeType extends NodeType
case object ListType extends NodeType

sealed trait NodeRoot
case object Structure extends NodeRoot
case object Schema extends NodeRoot

sealed trait Position
case object Inside extends Position
case object Above extends Position
case object Below extends Position

case class Node(
    id: Long,
    project: Long,
    name: String,
    nodeRoot: NodeRoot,
    sort: Int,
    children: List[Node]
) extends Entity

object Node {

}

case class NewNode(
    name: String,
    sort: Int
)

case class MoveNode(
    to: Long,
    open: Boolean,
    position: Position
)

case class RenameNode(
    name: String
)

case class NodeConfig(
   id: Long,
   node: Long,
   nodeType: NodeType
) extends Entity
