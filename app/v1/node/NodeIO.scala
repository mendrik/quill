package v1

import play.api.libs.functional.syntax._
import play.api.libs.json._
import v1.node._

package object NodeIO {


    implicit val newNodeReads: Reads[NewNode] = Json.reads[NewNode]

    implicit val renameNodeReads: Reads[RenameNode] = Json.reads[RenameNode]

    implicit val moveNodeReads: Reads[MoveNode] = (
        (__ \ "open").read[Boolean] ~
        (__ \ "position").read[String].map(toPosition)
    )(MoveNode.apply _)

    implicit val nodeReads: Reads[Node] = (
        (__ \ "id").read[Long] ~
        (__ \ "project").read[Long] ~
        (__ \ "name").read[String] ~
        (__ \ "nodeRoot").read[String].map(toNodeRoot) ~
        (__ \ "nodeType").read[String].map(toNodeType) ~
        (__ \ "sort").read[Int] ~
        (__ \ "children").lazyRead(Reads.list[Node](nodeReads))
    )(Node.apply _)

    implicit val nodeWrites: Writes[Node] = (
        (__ \ "id").write[Long] ~
        (__ \ "project").write[Long] ~
        (__ \ "name").write[String] ~
        (__ \ "rootType").write[NodeRoot] ~
        (__ \ "type").write[NodeType] ~
        (__ \ "sort").write[Int] ~
        (__ \ "children").lazyWrite[List[Node]](Writes.list(nodeWrites))
    )(unlift(Node.unapply))

    implicit def nodeRootWrites: Writes[NodeRoot] = new Writes[NodeRoot] {
        def writes(n: NodeRoot) = JsString(asString(n))
    }

    implicit def nodeTypeWrites: Writes[NodeType] = new Writes[NodeType] {
        def writes(n: NodeType) = JsString(asString(n))
    }

    implicit def toNodeType(s: String): NodeType = s.toLowerCase match {
        case "bool" => BoolType
        case "number" => NumberType
        case "string" => StringType
        case "date" => DateType
        case "node" => NodeType
        case "list" => ListType
    }

    implicit def asString(nodeType: NodeType): String = nodeType match {
        case BoolType => "bool"
        case NumberType => "number"
        case StringType => "string"
        case DateType => "date"
        case NodeType => "node"
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

