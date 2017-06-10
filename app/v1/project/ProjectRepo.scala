package v1.project

import javax.inject.Singleton

import io.strongtyped.active.slick.EntityActions
import io.strongtyped.active.slick.JdbcProfileProvider.MySQLProfileProvider
import io.strongtyped.active.slick.Lens._
import slick.ast.BaseTypedType

import scala.language.postfixOps

@Singleton
class ProjectRepo extends EntityActions with MySQLProfileProvider {

  import jdbcProfile.api._
  val baseTypedType = implicitly[BaseTypedType[Id]]

  type Entity = Project
  type Id = Int
  type EntityTable = ProjectTable

  val tableQuery = TableQuery[ProjectTable]

  def $id(table: ProjectTable): Rep[Id] = table.id

  val idLens = lens { project: Project => project.id } { (project, id) => project.copy(id = id) }

  class ProjectTable(tag: Tag) extends Table[Project](tag, "project") {
    def name = column[String]("NAME")
    def id = column[Id]("ID", O.PrimaryKey, O.AutoInc)
    def * = (id.?, name) <> (Project.tupled, Project.unapply)
  }

  def findByName(name: String): DBIO[Seq[Project]] = {
    tableQuery.filter(_.name === name).result
  }

}

