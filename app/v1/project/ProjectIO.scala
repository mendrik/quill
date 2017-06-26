package v1

import play.api.libs.json._
import v1.project.Project // Combinator syntax

package object ProjectIO {

    implicit val projectReads: Reads[Project] = Json.reads[Project]

    implicit val projectWrites : Writes[Project] = Json.writes[Project]

}
