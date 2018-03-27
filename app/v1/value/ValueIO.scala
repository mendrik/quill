package v1

import org.joda.time.{DateTime, LocalDateTime}
import play.api.libs.functional.syntax._
import play.api.libs.json.Reads._
import play.api.libs.json._
import v1.NodeIO._
import v1.node.Node
import v1.value.{Value, ValueNode}


package object ValueIO {
    implicit val dateFormat: Format[DateTime] = utils.Implicits.dateFormat

    implicit val valueReads: Reads[Value] = (
        (__ \ "id").read[Long] ~
        (__ \ "version").read[Long] ~
        (__ \ "nodeId").read[Long] ~
        (__ \ "arrVal").read[Boolean] ~
        (__ \ "strVal").readNullable[String] ~
        (__ \ "numVal").readNullable[Long] ~
        (__ \ "decVal").readNullable[BigDecimal] ~
        (__ \ "dateVal").readNullable[DateTime] ~
        (__ \ "boolVal").readNullable[Boolean]
    )(Value.apply _)

    implicit val valueWrites: Writes[Value] = (
        (__ \ "id").write[Long] ~
        (__ \ "version").write[Long] ~
        (__ \ "nodeId").write[Long]  ~
        (__ \ "arrVal").write[Boolean] ~
        (__ \ "strVal").writeNullable[String] ~
        (__ \ "numVal").writeNullable[Long] ~
        (__ \ "decVal").writeNullable[BigDecimal] ~
        (__ \ "dateVal").writeNullable[DateTime] ~
        (__ \ "boolVal").writeNullable[Boolean]
    )(unlift(Value.unapply))

    implicit val valueNodeReads: Reads[ValueNode] = (
        (__ \ "node").read[Node] ~
        (__ \ "value").read[Value] ~
        (__ \ "children").lazyRead(Reads.list[ValueNode](valueNodeReads))
    )(ValueNode.apply _)

    implicit val valueNodeWrites: Writes[ValueNode] = (
        (__ \ "node").write[Node] ~
        (__ \ "value").write[Value] ~
        (__ \ "children").lazyWrite[Seq[ValueNode]](Writes.seq(valueNodeWrites))
    )(unlift(ValueNode.unapply))

}

