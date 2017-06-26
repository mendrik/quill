package v1

import v1.node._

package object NodeIO {

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
}

