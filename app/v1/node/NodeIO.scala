package v1

import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.libs.json.Reads._
import v1.node.{MultilineEditor, _}

package object NodeIO {

    implicit val nodeTypeReads: Reads[NodeType] = {
        case JsString(StringType.name) => JsSuccess(StringType)
        case JsString(MultilineType.name) => JsSuccess(MultilineType)
        case JsString(NumberType.name) => JsSuccess(NumberType)
        case JsString(FractionType.name) => JsSuccess(FractionType)
        case JsString(BoolType.name) => JsSuccess(BoolType)
        case JsString(DateType.name) => JsSuccess(DateType)
        case JsString(DatetimeType.name) => JsSuccess(DatetimeType)
        case JsString(EnumType.name) => JsSuccess(EnumType)
        case JsString(ListType.name) => JsSuccess(ListType)
        case _ => JsError()
    }

    implicit val nodeTypeWrites: Writes[NodeType] = {
        case n: NodeType => JsString(n.name)
    }

    implicit val nodeReads: Reads[Node] = (
        (__ \ "id").read[Long] ~
        (__ \ "project").read[Long] ~
        (__ \ "name").read[String] ~
        (__ \ "nodeType").read[NodeType] ~
        (__ \ "children").lazyRead(Reads.list[Node](nodeReads))
    )(Node.apply _)

    implicit val nodeWrites: Writes[Node] = (
        (__ \ "id").write[Long] ~
        (__ \ "project").write[Long] ~
        (__ \ "name").write[String] ~
        (__ \ "type").write[NodeType] ~
        (__ \ "children").lazyWrite[List[Node]](Writes.list(nodeWrites))
    )(unlift(Node.unapply))

    implicit val positionReads: Reads[Position] = {
        case JsString(Inside.name) => JsSuccess(Inside)
        case JsString(Below.name) => JsSuccess(Below)
        case JsString(Above.name) => JsSuccess(Above)
        case _ => JsError()
    }

    implicit val positionWrites: Writes[Position] = {
        case p: Position => JsString(p.name)
    }

    implicit val multilineReads: Reads[MultilineEditor] = {
        case JsString(Normal.name) => JsSuccess(Normal)
        case JsString(Richtext.name) => JsSuccess(Richtext)
        case JsString(Markdown.name) => JsSuccess(Markdown)
        case _ => JsError()
    }

    implicit val multilineWrites: Writes[MultilineEditor] = {
        case m: MultilineEditor => JsString(m.name)
    }

    implicit val numberReads: Reads[NumberEditor] = {
        case JsString(NumberInput.name) => JsSuccess(NumberInput)
        case JsString(Slider.name) => JsSuccess(Slider)
        case _ => JsError()
    }

    implicit val numberWrites: Writes[NumberEditor] = {
        case n: NumberEditor => JsString(n.name)
    }

    implicit val booleanReads: Reads[BooleanEditor] = {
        case JsString(Checkbox.name) => JsSuccess(Checkbox)
        case JsString(Switch.name) => JsSuccess(Switch)
        case _ => JsError()
    }

    implicit val booleanWrites: Writes[BooleanEditor] = {
        case b: BooleanEditor => JsString(b.name)
    }

    implicit val moveNodeReads: Reads[MoveNode] = (
       (__ \ "to").read[Long] ~
       (__ \ "open").read[Boolean] ~
       (__ \ "position").read[Position]
    )(MoveNode.apply _)

    implicit val newNodeReads: Reads[NewNode] = Json.reads[NewNode]
    implicit val renameNodeReads: Reads[RenameNode] = Json.reads[RenameNode]
    implicit val nodeConfigStringFormat: Format[NodeConfigString] = Json.format[NodeConfigString]
    implicit val nodeConfigMultilineFormat: Format[NodeConfigMultiline] = Json.format[NodeConfigMultiline]
    implicit val nodeConfigNumberFormat: Format[NodeConfigNumber] = Json.format[NodeConfigNumber]
    implicit val nodeConfigFractionFormat: Format[NodeConfigFraction] = Json.format[NodeConfigFraction]
    implicit val nodeConfigBooleanFormat: Format[NodeConfigBoolean] = Json.format[NodeConfigBoolean]
    implicit val nodeConfigEnumFormat: Format[NodeConfigEnum] = Json.format[NodeConfigEnum]
    implicit val nodeConfigDateFormat: Format[NodeConfigDate] = Json.format[NodeConfigDate]
    implicit val nodeConfigDatetimeFormat: Format[NodeConfigDatetime] = Json.format[NodeConfigDatetime]
    implicit val nodeConfigListFormat: Format[NodeConfigList] = Json.format[NodeConfigList]
    implicit val nodeConfigFormat: Format[NodeConfig] = Json.format[NodeConfig]

    implicit def multilineFromString[A <: MultilineEditor](str: String)(implicit r: Reads[A]): A = r.reads(JsString(str)).get
    implicit def nodeTypeFromString[A <: NodeType](str: String)(implicit r: Reads[A]): A = r.reads(JsString(str)).get
    implicit def numberFromString[A <: NumberEditor](str: String)(implicit r: Reads[A]): A = r.reads(JsString(str)).get
    implicit def booleanFromString[A <: BooleanEditor](str: String)(implicit r: Reads[A]): A = r.reads(JsString(str)).get

    implicit def traitToString[A <: WritableTrait](a: A): String = a.name

}

