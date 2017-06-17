package v1.project

case class Project(id: Option[Int] = None, name: String)

case class CreateProject(name: String)

