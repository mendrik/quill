package v1.generic

import org.hashids.Hashids
import v1.project.Project
import v1.user.User

trait Entity {
    val id: Long
}


package object extensions {

    val hashids = Hashids.reference("p4013c7-1Ds")

    implicit class ProjectExtensions(project: Project) {

        def hash = hashids.encode(project.id)

    }

    implicit class UserExtensions(user: User) {

        def lastProjectHash = hashids.encode(user.lastProject.get)

    }
}

