import play.api.data.validation.ValidationError
import play.api.libs.json.Reads._
import play.api.libs.json.{Reads, _}

package object json {

    implicit class JsPathExtra(p: JsPath) {

        def readOrError[T](error: => String)(implicit r: Reads[T]): Reads[T] = new Reads[T] {
            def reads(json: JsValue): JsResult[T] = p.readNullable(r).reads(json) match {
                case JsSuccess(Some(value), _) => JsSuccess(value, p)
                case JsSuccess(None, _)        => JsError(p, ValidationError(error))
                case err@JsError(_)            => err
            }
        }

        def readList[A](implicit r: Reads[List[A]]): Reads[List[A]] = Reads.at(p)

        def readWithDefault[A](default: A)(implicit r: Reads[A]) =
            p.read[A].orElse(Reads.pure(default))

        def nonEmptyWith(reads: Reads[String])(implicit r: Reads[String]): Reads[String] =
            readOrError[String]("errors.required")(reads)

        def nonEmpty()(implicit r: Reads[String]): Reads[String] =
            p.readOrError[String]("errors.required").filter(ValidationError("errors.required"))(_.trim.nonEmpty)

    }

}

