import play.api.data.validation.ValidationError
import play.api.libs.json._
import play.api.libs.json.Reads._

package object json {

    implicit class JsPathExtra(p: JsPath) {

        def readWithDefault[A](default: A)(implicit r: Reads[A]) =
            p.read[A].orElse(Reads.pure(default))

        def nonEmpty(implicit r: Reads[String]): Reads[String] =
            p.read[String].filter(ValidationError("errors.required"))(_.nonEmpty)

    }

}
