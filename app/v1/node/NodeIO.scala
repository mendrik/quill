package v1

import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.libs.json.Reads._
import v1.node._

package object NodeIO {


    implicit val newNodeReads: Reads[NewNode] = Json.reads[NewNode]

    implicit val renameNodeReads: Reads[RenameNode] = Json.reads[RenameNode]

    implicit val moveNodeReads: Reads[MoveNode] = (
        (__ \ "to").read[Long] ~
        (__ \ "open").read[Boolean] ~
        (__ \ "position").read[String].map(toPosition)
    )(MoveNode.apply _)

    implicit val nodeReads: Reads[Node] = (
        (__ \ "id").read[Long] ~
        (__ \ "project").read[Long] ~
        (__ \ "name").read[String] ~
        (__ \ "nodeRoot").read[String].map(toNodeRoot) ~
        (__ \ "sort").read[Int] ~
        (__ \ "children").lazyRead(Reads.list[Node](nodeReads))
    )(Node.apply _)

    implicit val nodeWrites: Writes[Node] = (
        (__ \ "id").write[Long] ~
        (__ \ "project").write[Long] ~
        (__ \ "name").write[String] ~
        (__ \ "rootType").write[NodeRoot] ~
        (__ \ "sort").write[Int] ~
        (__ \ "children").lazyWrite[List[Node]](Writes.list(nodeWrites))
    )(unlift(Node.unapply))

    implicit val nodeConfigReads: Reads[NodeConfig] = (
        (__ \ "id").read[Long] ~
        (__ \ "node").read[Long] ~
        (__ \ "type").read[String].map(toNodeType)
    )(NodeConfig.apply _)

    implicit val nodeConfigWrites: Writes[NodeConfig] = (
        (__ \ "id").write[Long] ~
        (__ \ "node").write[Long] ~
        (__ \ "type").write[NodeType]
    )(unlift(NodeConfig.unapply))

    implicit def nodeRootWrites: Writes[NodeRoot] = new Writes[NodeRoot] {
        def writes(n: NodeRoot) = JsString(asString(n))
    }

    implicit def nodeTypeWrites: Writes[NodeType] = new Writes[NodeType] {
        def writes(n: NodeType) = JsString(asString(n))
    }

    implicit def toNodeType(s: String): NodeType = s.toLowerCase match {
        case "bool" => BoolType
        case "number" => NumberType
        case "fraction" => FractionType
        case "string" => StringType
        case "multiline" => MultilineType
        case "date" => DateType
        case "datetime" => DatetimeType
        case "enum" => EnumType
        case "list" => ListType
    }

    implicit def asString(nodeType: NodeType): String = nodeType match {
        case BoolType => "bool"
        case NumberType => "number"
        case FractionType => "fraction"
        case StringType => "string"
        case MultilineType => "multiline"
        case DateType => "date"
        case DatetimeType => "datetime"
        case EnumType => "enum"
        case ListType => "list"
    }

    implicit def toNodeRoot(s: String): NodeRoot = s.toLowerCase match {
        case "structure" => Structure
        case "schema" => Schema
    }

    implicit def asString(nodeRoot: NodeRoot): String = nodeRoot match {
        case Structure => "structure"
        case Schema => "schema"
    }

    implicit def toPosition(s: String): Position = s.toLowerCase match {
        case "inside" => Inside
        case "below" => Below
        case "above" => Above
    }

    implicit def asString(position: Position): String = position match {
        case Inside => "inside"
        case Above => "above"
        case Below => "below"
    }
}

