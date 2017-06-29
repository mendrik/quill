package v1

import json._
import play.api.libs.functional.syntax._
import play.api.libs.json.Reads._
import play.api.libs.json._
import v1.NodeIO._
import v1.node.Node
import v1.project.Project

package object ProjectIO {

    implicit val projectReads: Reads[Project] = (
        (__ \ "id").read[Long] ~
        (__ \ "name").readNullable[String] ~
        (__ \ "structure").readWithDefault[List[Node]](Nil) ~
        (__ \ "schema").readWithDefault[List[Node]](Nil)
    )(Project.apply _)

    implicit val projectWrites : Writes[Project] = new Writes[Project] {
        override def writes(p: Project): JsValue = {
            Json.obj(
                "id" -> p.id,
                "name" -> p.name,
                "structure" -> p.structure,
                "schema" -> p.schema
            )
        }

    }

}
