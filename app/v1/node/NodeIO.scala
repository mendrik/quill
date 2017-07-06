package v1

import json._
import play.api.libs.json.{Json, Reads, Writes, __}
import play.api.libs.functional.syntax._
import v1.node._

package object NodeIO {

    implicit val newNodeReads = Json.reads[NewNode]

    implicit val nodeReads: Reads[Node] = (
        (__ \ "id").read[Long] ~
        (__ \ "name").read[String] ~
        (__ \ "nodeRoot").read[String].map(toNodeRoot) ~
        (__ \ "nodeType").read[String].map(toNodeType) ~
        (__ \ "sort").read[Int] ~
        (__ \ "children").lazyRead(Reads.list[Node](nodeReads))
    )(Node.apply _)

    implicit val nodeWrites: Writes[Node] = new Writes[Node] {
        def writes(n: Node) = Json.obj(
            "id" -> n.id,
            "name" -> n.name,
            "type" -> asString(n.nodeType),
            "rootType" -> asString(n.nodeRoot),
            "sort" -> n.sort
        )
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
}

