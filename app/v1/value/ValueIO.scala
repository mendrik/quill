package v1

import org.joda.time.DateTime
import play.api.libs.functional.syntax._
import play.api.libs.json.Reads._
import play.api.libs.json._
import v1.NodeIO._
import v1.node.Node
import v1.value.{Value, ValueNode}


package object ValueIO {
    implicit val dateFormat: Format[DateTime] = utils.Implicits.dateFormat

    implicit val valueFormat: Format[Value] = Json.format[Value]

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

