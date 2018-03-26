package v1.value

import v1.generic.Entity
import v1.node.Node

case class Value(id: Long, nodeId: Long) extends Entity

case class ValueNode(node: Node, value: Value, children: Seq[ValueNode])


