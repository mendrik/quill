package v1.node

import v1.generic.Entity

sealed trait NodeType
case object StringType extends NodeType
case object MultilineType extends NodeType
case object NumberType extends NodeType
case object FractionType extends NodeType
case object BoolType extends NodeType
case object DateType extends NodeType
case object DatetimeType extends NodeType
case object EnumType extends NodeType
case object ListType extends NodeType

sealed trait Position
case object Inside extends Position
case object Above extends Position
case object Below extends Position

sealed trait MultilineEditor
case object Normal extends MultilineEditor
case object Richtext extends MultilineEditor
case object Markdown extends MultilineEditor

sealed trait NumberEditor
case object NumberInput extends NumberEditor
case object Slider extends NumberEditor

sealed trait BooleanEditor
case object Checkbox extends BooleanEditor
case object Switch extends BooleanEditor

case class Node(
    id: Long,
    project: Long,
    name: String,
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
   nodeType: NodeType,
   string: NodeConfigString,
   multiline: NodeConfigMultiline,
   number: NodeConfigNumber,
   fraction: NodeConfigFraction,
   boolean: NodeConfigBoolean,
   enum: NodeConfigEnum
) extends Entity

case class NodeConfigString(
    validation: String
)
case class NodeConfigMultiline(
    editor: MultilineEditor
)
case class NodeConfigNumber(
    editor: NumberEditor
)
case class NodeConfigBoolean(
    editor: BooleanEditor
)
case class NodeConfigEnum(
    values: List[String]
)
case class NodeConfigFraction(
    format: String
)
case class NodeConfigDate(
    format: String
)
case class NodeConfigDatetime(
    format: String
)
case class NodeConfigList(
    filter: String
)
