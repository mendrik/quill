package v1.generic

import org.hashids.Hashids
import v1.project.Project
import v1.user.User

trait Entity {
    val id: Long
}

package object extensions {

    val hashids: Hashids = Hashids("p4013c7-1Ds", 7)

    def decodeHash(hash: String): Option[Long] = hashids.decode(hash).headOption.map(_.toLong)

    implicit class ProjectExtensions(project: Project) {
        def hash: String = hashids.encode(project.id.toLong)
    }

    implicit class UserExtensions(user: User) {
        def lastProjectHash: String = hashids.encode(user.lastProject.get)
    }
}

