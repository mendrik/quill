package utils

import com.mohiva.play.silhouette.api.Silhouette
import com.mohiva.play.silhouette.api.actions.UserAwareRequest
import error.ReadError
import play.api.i18n.{Lang, MessagesApi}
import play.api.libs.json._
import play.api.mvc._
import security.QuillEnv
import v1.user.User

import scala.concurrent.Future

case class BodyParseException(jsErrors: scala.Seq[(JsPath, scala.Seq[JsonValidationError])]) extends Exception {

    def errors(ma: MessagesApi)(implicit lang: Lang): Seq[ReadError] = jsErrors.flatMap { case (path, e) =>
        val fieldName = path.path match {
            case p :: Nil => p match {
                case p: KeyPathNode => Some(p.key)
                case _ => None
            }
            case _ => None
        }
        fieldName.map { field =>
            val fieldWithPrefix = field
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

    def json[C](block: (C, RequestHeader) => Future[Result])
               (implicit reads: Reads[C], parser: BodyParser[JsValue],
                builder: DefaultActionBuilder): Action[JsValue] =
        builder.async(parser) { request =>
            request.body.validate[C] match {
                case JsSuccess(json, _) =>
                    block(json, request)
                case JsError(errors) =>
                    throw BodyParseException(errors)
            }
        }

    def securedJson[C](block: (C, UserAwareRequest[QuillEnv, JsValue]) => Future[Result])
                      (implicit reads: Reads[C], silhouette: Silhouette[QuillEnv], parser: BodyParser[JsValue]): Action[JsValue] =
        silhouette.UserAwareAction.async(parser) { request =>
            request.body.validate[C] match {
                case JsSuccess(json, _) =>
                    block(json, request)
                case JsError(errors) =>
                    throw BodyParseException(errors)
            }
        }

    def secured(block: (UserAwareRequest[QuillEnv, AnyContent]) => Future[Result])
               (implicit silhouette: Silhouette[QuillEnv]): Action[AnyContent] =
        silhouette.UserAwareAction.async { request =>
            block(request)
        }

}
