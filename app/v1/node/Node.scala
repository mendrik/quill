package v1.node

import v1.generic.Entity

sealed trait NodeType
case object BoolType extends NodeType
case object NumberType extends NodeType
case object StringType extends NodeType
case object DateType extends NodeType
case object NodeType extends NodeType
case object ListType extends NodeType

sealed trait NodeRoot
case object Structure extends NodeRoot
case object Schema extends NodeRoot

sealed trait Position
case object Inside extends Position
case object Above extends Position
case object Below extends Position

case class Node(
    id: Int,
    project: Int,
    name: String,
    nodeRoot: NodeRoot,
    nodeType: NodeType,
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
    to: Int,
    open: Boolean,
    position: Position
)

case class RenameNode(
    name: String
)
