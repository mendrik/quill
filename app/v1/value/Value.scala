package v1.value

import org.joda.time.DateTime
import v1.generic.Entity
import v1.node.Node

case class Value(
  id: Long,
  version: Long,
  nodeId: Long,
  arrVal: Boolean,
  strVal: Option[String],
  numVal: Option[Long],
  decVal: Option[BigDecimal],
  dateVal: Option[DateTime],
  boolVal: Option[Boolean]
) extends Entity

case class ValueNode(
  node: Node,
  value: Value,
  children: Seq[ValueNode]
)


