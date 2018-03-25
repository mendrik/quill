package v1

import json._
import play.api.libs.functional.syntax._
import play.api.libs.json._
import v1.node.Node
import v1.project.Project
import v1.version.Version
import v1.NodeIO._
import v1.VersionIO._

package object ProjectIO {

    implicit val projectReads: Reads[Project] = (
        (__ \ "id").read[Long] ~
        (__ \ "name").readNullable[String] ~
        (__ \ "structure").readList[Node] ~
        (__ \ "schema").readList[Node] ~
        (__ \ "versions").readList[Version]
    ) (Project.apply _)

    implicit val projectWrites: Writes[Project] = (
        (__ \ "id").write[Long] ~
        (__ \ "name").writeNullable[String] ~
        (__ \ "structure").write[Seq[Node]] ~
        (__ \ "schema").write[Seq[Node]] ~
        (__ \ "versions").write[Seq[Version]]
    )(unlift(Project.unapply))

}
