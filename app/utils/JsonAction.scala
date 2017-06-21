package utils

import play.api.data.validation.ValidationError
import play.api.i18n.MessagesApi
import play.api.libs.json._
import play.api.mvc._

import scala.concurrent.Future

case class BodyParseException(prefix: Option[String], jsErrors: scala.Seq[(JsPath, scala.Seq[ValidationError])]) extends Exception {
    def errors(ma: MessagesApi): Seq[error.ValidationError] = jsErrors.map { case (path, e) =>
        val field = prefix.map(_ + ".").getOrElse("") + path.toString.tail
        val tranlatedField = ma.translate(field, Nil)
        error.ValidationError(field, e.map(v => ma.translate(v.message, Seq(tranlatedField))).mkString(" and "))
    }
}

object Actions extends Results {

    case class JsonRequest[C, A](json: C, request: Request[A]) extends WrappedRequest(request)

    def json[C](block: C => Future[Result])(implicit reads: Reads[C]): ((C) => Future[Result]) => Action[JsValue] = json[C](None)

    def json[C](prefix: Option[String] = None)(block: C => Future[Result])(implicit reads: Reads[C]) = Action.async(BodyParsers.parse.json) { request =>
        request.body.validate[C] match {
            case JsSuccess(json, _) =>
                block(json)
            case JsError(errors) =>
                println(errors)
                throw BodyParseException(prefix, errors)
        }
    }
}
