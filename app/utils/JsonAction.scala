package utils

import play.api.data.validation.ValidationError
import play.api.libs.json._
import play.api.mvc._

import scala.concurrent.Future

case class BodyParseException(prefix: Option[String], errors: scala.Seq[(JsPath, scala.Seq[ValidationError])]) extends Exception

object Actions extends Results {

    case class JsonRequest[C, A](json: C, request: Request[A]) extends WrappedRequest(request)

    def json[C](prefix: Option[String] = None)(block: C => Future[Result])(implicit reads: Reads[C]) = Action.async(BodyParsers.parse.json) { request =>
        request.body.validate[C] match {
            case JsSuccess(json, _) => block(json)
            case JsError(errors) => throw BodyParseException(prefix, errors)
        }
    }
}
