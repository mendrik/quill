package v1.version

import v1.generic.Entity

case class Version(
    id: Long,
    project: Long,
    name: String,
    icon: String
) extends Entity


