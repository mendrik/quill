package v1

import play.api.libs.functional.syntax._
import play.api.libs.json._
import play.api.libs.json.Reads._
import v1.value.Value
import v1.version.Version
import v1.ValueIO._

package object VersionIO {

    implicit val versionReads: Reads[Version] = (
        (__ \ "id").read[Long] ~
        (__ \ "project").read[Long] ~
        (__ \ "name").read[String] ~
        (__ \ "icon").read[String] ~
        (__ \ "values").read[Seq[Value]]
    )(Version.apply _)

    implicit val versionWrites: Writes[Version] = (
        (__ \ "id").write[Long] ~
        (__ \ "project").write[Long] ~
        (__ \ "name").write[String] ~
        (__ \ "icon").write[String] ~
        (__ \ "values").write[Seq[Value]]
    )(unlift(Version.unapply))
}

