package utils

import error.ReadError
import play.api.data.validation.ValidationError
import play.api.i18n.MessagesApi
import play.api.libs.json._
import play.api.mvc._

import scala.concurrent.Future

case class BodyParseException(prefix: Option[String], jsErrors: scala.Seq[(JsPath, scala.Seq[ValidationError])]) extends Exception {
    def errors(ma: MessagesApi): Seq[ReadError] = jsErrors.flatMap { case (path, e) =>
        val fieldName = path.path match {
            case p :: Nil => p match {
                case p: KeyPathNode => Some(p.key)
                case _ => None
            }
            case _ => None
        }
        fieldName.map { field =>
            val fieldWithPrefix = prefix.map(_ + ".").getOrElse("") + field
            val translatedFieldName = ma.translate(fieldWithPrefix, Nil).getOrElse(fieldWithPrefix)
            val and = ma.translate("joins.and", Nil)
            val errorMessage = e.map(v =>
                v.messages.map(m => {
                    val oldArgs = e.headOption.map(_.args).getOrElse(Nil).toList
                    ma.translate(m, List(translatedFieldName) ::: oldArgs).getOrElse(m)
                }
                ).mkString(" and ")
            ).mkString(" and ")
            ReadError(fieldWithPrefix, errorMessage.capitalize)
        }
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
