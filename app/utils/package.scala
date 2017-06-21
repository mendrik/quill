import play.api.data.validation.ValidationError
import play.api.libs.json._
import play.api.libs.json.Reads._

package object json {

    implicit class JsPathExtra(p: JsPath) {

        def readOrError[T](error: => String)(implicit r: Reads[T]): Reads[T] = new Reads[T] {
            def reads(json: JsValue): JsResult[T] = p.readNullable(r).reads(json) match {
                case JsSuccess(Some(value: String), _) if value.isEmpty => JsError((p, ValidationError(error)))
                case JsSuccess(Some(value), _) => JsSuccess(value, p)
                case JsSuccess(None, _)        => JsError((p, ValidationError(error)))
                case err@JsError(_)            => err
            }
        }

        def readWithDefault[A](default: A)(implicit r: Reads[A]) =
            p.read[A].orElse(Reads.pure(default))

        def nonEmpty(reads: Reads[String])(implicit r: Reads[String]): Reads[String] =
            p.readOrError[String]("errors.required").orElse(reads)

        def nonEmpty()(implicit r: Reads[String]): Reads[String] =
            p.readOrError[String]("errors.required")

    }

}