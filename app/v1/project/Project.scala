package v1.project

import v1.generic.Entity

case class Project(id: Long, name: Option[String]) extends Entity
