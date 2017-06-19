package utils

import play.api.data.validation.ValidationError
import play.api.libs.json._
import play.api.mvc._
import utils.Actions.Errors

import scala.concurrent.Future

case class BodyParseException(errors: Errors) extends Exception

object Actions extends Results {

    type Errors = scala.Seq[(JsPath, scala.Seq[ValidationError])]

    case class JsonRequest[C, A](json: C, request: Request[A]) extends WrappedRequest(request)

    def json[C](block: C => Future[Result])(implicit reads: Reads[C]) = Action.async(BodyParsers.parse.json) { request =>
        request.body.validate[C] match {
            case JsSuccess(json, _) => block(json)
            case JsError(errors) => throw BodyParseException(errors)
        }
    }
}
