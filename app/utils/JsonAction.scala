package utils

import com.mohiva.play.silhouette.api.Silhouette
import error.ReadError
import play.api.i18n.{Lang, MessagesApi}
import play.api.libs.json._
import play.api.mvc._
import security.rules.SecurityRule
import security.{QuillEnv, SecurityRules}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

case class BodyParseException(prefix: Option[String], jsErrors: scala.Seq[(JsPath, scala.Seq[JsonValidationError])]) extends Exception {

    def errors(ma: MessagesApi)(implicit lang: Lang): Seq[ReadError] = jsErrors.flatMap { case (path, e) =>
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

    def json[C](prefix: Option[String] = None)
               (block: (C, RequestHeader) => Future[Result])
               (implicit reads: Reads[C], parser: BodyParser[JsValue],
                builder: DefaultActionBuilder): Action[JsValue] =
        builder.async(parser) { request =>
            request.body.validate[C] match {
                case JsSuccess(json, _) =>
                    block(json, request)
                case JsError(errors) =>
                    throw BodyParseException(prefix, errors)
        }
    }

    def securedJson[C](prefix: Option[String], rules: SecurityRule*)
                      (block: (C, RequestHeader) => Future[Result])
                      (implicit reads: Reads[C], silhouette: Silhouette[QuillEnv],
                       securityRules: SecurityRules, parser: BodyParser[JsValue]): Action[JsValue] =
        silhouette.UserAwareAction.async(parser) { request =>
            securityRules.checkRules(request.identity, rules).flatMap { _ =>
                request.body.validate[C] match {
                    case JsSuccess(json, _) =>
                        block(json, request.request)
                    case JsError(errors) =>
                        throw BodyParseException(prefix, errors)
                }
            }
        }

    def secured(rules: SecurityRule*)
               (block: RequestHeader => Future[Result])
               (implicit silhouette: Silhouette[QuillEnv], securityRules: SecurityRules) =
        silhouette.UserAwareAction.async { request =>
            securityRules.checkRules(request.identity, rules).flatMap { _ =>
                block(request.request)
            }
        }

}
