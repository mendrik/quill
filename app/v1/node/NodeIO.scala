package v1

import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.libs.json.Reads._
import v1.node.{MultilineEditor, _}

package object NodeIO {


    implicit val nodeReads: Reads[Node] = (
        (__ \ "id").read[Long] ~
        (__ \ "project").read[Long] ~
        (__ \ "name").read[String] ~
        (__ \ "sort").read[Int] ~
        (__ \ "children").lazyRead(Reads.list[Node](nodeReads))
    )(Node.apply _)

    implicit val nodeWrites: Writes[Node] = (
        (__ \ "id").write[Long] ~
        (__ \ "project").write[Long] ~
        (__ \ "name").write[String] ~
        (__ \ "sort").write[Int] ~
        (__ \ "children").lazyWrite[List[Node]](Writes.list(nodeWrites))
    )(unlift(Node.unapply))

    implicit val nodeTypeReads: Reads[NodeType] = {
        case JsString("string") => JsSuccess(StringType)
        case JsString("multiline") => JsSuccess(MultilineType)
        case JsString("number") => JsSuccess(NumberType)
        case JsString("fraction") => JsSuccess(FractionType)
        case JsString("boolean") => JsSuccess(BoolType)
        case JsString("date") => JsSuccess(DateType)
        case JsString("datetime") => JsSuccess(DatetimeType)
        case JsString("enum") => JsSuccess(EnumType)
        case JsString("list") => JsSuccess(ListType)
        case _ => JsError()
    }

    implicit val nodeTypeWrites: Writes[NodeType] = {
        case StringType => JsString("string")
        case MultilineType => JsString("multiline")
        case NumberType => JsString("number")
        case FractionType => JsString("fraction")
        case BoolType => JsString("boolean")
        case DateType => JsString("date")
        case DatetimeType => JsString("datetime")
        case EnumType => JsString("enum")
        case ListType => JsString("list")
    }

    implicit val positionReads: Reads[Position] = {
        case JsString("inside") => JsSuccess(Inside)
        case JsString("below") => JsSuccess(Below)
        case JsString("above") => JsSuccess(Above)
        case _ => JsError()
    }

    implicit val positionWrites: Writes[Position] = {
        case Inside => JsString("inside")
        case Below => JsString("below")
        case Above => JsString("above")
    }

    implicit val multilineReads: Reads[MultilineEditor] = {
        case JsString("normal") => JsSuccess(Normal)
        case JsString("richtext") => JsSuccess(Richtext)
        case JsString("markdown") => JsSuccess(Markdown)
        case _ => JsError()
    }

    implicit val multilineWrites: Writes[MultilineEditor] = {
        case Normal => JsString("normal")
        case Richtext => JsString("richtext")
        case Markdown => JsString("markdown")
    }

    implicit val numberReads: Reads[NumberEditor] = {
        case JsString("input") => JsSuccess(NumberInput)
        case JsString("slider") => JsSuccess(Slider)
        case _ => JsError()
    }

    implicit val numberWrites: Writes[NumberEditor] = {
        case NumberInput => JsString("input")
        case Slider => JsString("slider")
    }

    implicit val booleanReads: Reads[BooleanEditor] = {
        case JsString("checkbox") => JsSuccess(Checkbox)
        case JsString("switch") => JsSuccess(Switch)
        case _ => JsError()
    }

    implicit val booleanWrites: Writes[BooleanEditor] = {
        case Checkbox => JsString("checkbox")
        case Switch => JsString("switch")
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
    implicit val nodeConfigFormat: Format[NodeConfig] = Json.format[NodeConfig]

    implicit def traitRead[A](input: String)(implicit r: Reads[A]): A =
        r.reads(JsString(input)).get

    implicit def traitWrites[A](a: A)(implicit w: Writes[A]): String =
        w.writes(a).toString
}

