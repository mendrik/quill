package v1

import play.api.libs.json._
import v1.project.CreateProject // Combinator syntax

package object ProjectIO {

    implicit val reads: Reads[CreateProject] = Json.reads[CreateProject]

}
