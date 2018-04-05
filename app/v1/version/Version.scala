package v1.version

import v1.generic.Entity
import v1.value.Value

case class Version(
    id: Long,
    project: Long,
    name: String,
    icon: String,
    values: Seq[Value]
) extends Entity


