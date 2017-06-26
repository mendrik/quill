package v1.project

import org.hashids.Hashids
import v1.generic.Entity

case class Project(id: Long, name: Option[String]) extends Entity

package object extensions {

    implicit class ProjectExtensions(project: Project) {

        val hashids = Hashids.reference("p4013c7-1Ds")

        def hash = hashids.encode(project.id)

    }
}

