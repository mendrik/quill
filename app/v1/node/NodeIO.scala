package v1

import play.api.libs.json.{Json, Writes}
import v1.node._

package object NodeIO {

    implicit val nodeWrites : Writes[Node] = new Writes[Node] {
        def writes(n: Node) = Json.obj(
            "id" -> n.id,
            "email" -> n.name,
            "firstname" -> n.nodeType.toString,
            "lastname" -> n.nodeRoot.toString
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

    implicit class NodeTypeExtension(nodeType: NodeType) {

        override def toString: String = nodeType match {
            case BoolType => "bool"
            case NumberType => "number"
            case StringType => "string"
            case DateType => "date"
            case NodeType => "node"
            case ListType => "list"
        }
    }

    implicit def toNodeRoot(s: String): NodeRoot = s.toLowerCase match {
        case "structure" => Structure
        case "schema" => Schema
    }

    implicit class NodeRootExtension(nodeType: NodeRoot) {

        override def toString: String = nodeType match {
            case Structure => "structure"
            case Schema => "schema"
        }
    }

}

