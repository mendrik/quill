package v1.project

import play.api.libs.json.{ Json, Reads }

case class Project(id: Option[Int] = None, name: String)

case class CreateProject(name: String)

object CreateProject {
  implicit val reads: Reads[CreateProject] = Json.reads[CreateProject]
}
