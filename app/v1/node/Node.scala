package v1.node

import v1.generic.Entity

sealed trait WritableTrait {
    val name: String
}

// ---

sealed trait NodeType extends WritableTrait {
    override val name: String = this match {
        case StringType => "string"
        case MultilineType => "text"
        case NumberType => "number"
        case FractionType => "fraction"
        case BoolType => "boolean"
        case DateType => "date"
        case DatetimeType => "datetime"
        case EnumType => "enum"
        case ListType => "list"
        case EmptyType => "none"
    }
}
case object StringType extends NodeType
case object MultilineType extends NodeType
case object NumberType extends NodeType
case object FractionType extends NodeType
case object BoolType extends NodeType
case object DateType extends NodeType
case object DatetimeType extends NodeType
case object EnumType extends NodeType
case object ListType extends NodeType
case object EmptyType extends NodeType

// ---

sealed trait Position extends WritableTrait {
    override val name: String = this match {
        case Inside => "inside"
        case Above => "above"
        case Below => "below"
    }
}
case object Inside extends Position
case object Above extends Position
case object Below extends Position

// ---

sealed trait MultilineEditor extends WritableTrait {
    override val name: String = this match {
        case Normal => "normal"
        case Richtext => "richtext"
        case Markdown => "markdown"
    }
}
case object Normal extends MultilineEditor
case object Richtext extends MultilineEditor
case object Markdown extends MultilineEditor

// ---

sealed trait NumberEditor extends WritableTrait {
    override val name: String = this match {
        case NumberInput => "input"
        case Slider => "slider"
    }
}
case object NumberInput extends NumberEditor
case object Slider extends NumberEditor

// ---

sealed trait BooleanEditor extends WritableTrait {
    override val name: String = this match {
        case Checkbox => "checkbox"
        case Switch => "switch"
    }
}
case object Checkbox extends BooleanEditor
case object Switch extends BooleanEditor

case class Node(
    id: Long,
    project: Long,
    name: String,
    nodeType: NodeType,
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
   nodeId: Long,
   nodeType: NodeType,
   string: NodeConfigString,
   multiline: NodeConfigMultiline,
   number: NodeConfigNumber,
   fraction: NodeConfigFraction,
   date: NodeConfigDate,
   datetime: NodeConfigDatetime,
   boolean: NodeConfigBoolean,
   enum: NodeConfigEnum,
   list: NodeConfigList
) extends Entity

object NodeConfig {
    def apply(id: Long, nodeId: Long, nodeType: NodeType) =
        new NodeConfig(
            id,
            nodeId,
            nodeType,
            NodeConfigString(),
            NodeConfigMultiline(),
            NodeConfigNumber(),
            NodeConfigFraction(),
            NodeConfigDate(),
            NodeConfigDatetime(),
            NodeConfigBoolean(),
            NodeConfigEnum(),
            NodeConfigList()
        )
}

case class NodeConfigString(
    validation: Option[String] = None
)
case class NodeConfigMultiline(
    editor: MultilineEditor = Normal
)
case class NodeConfigNumber(
    min: Option[Long] = None,
    max: Option[Long] = None,
    editor: NumberEditor = NumberInput
)
case class NodeConfigBoolean(
    editor: BooleanEditor = Switch
)
case class NodeConfigEnum(
    values: Seq[String] = Nil
)
case class NodeConfigFraction(
    format: Option[String] = None
)
case class NodeConfigDate(
    format: Option[String] = None
)
case class NodeConfigDatetime(
    format: Option[String] = None
)
case class NodeConfigList(
    filter: Option[String] = None
)
