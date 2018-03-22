package error

import javax.inject._
import com.mohiva.play.silhouette.api.actions.{SecuredErrorHandler, UnsecuredErrorHandler}
import com.mohiva.play.silhouette.impl.exceptions.{IdentityNotFoundException, InvalidPasswordException}
import error.ErrorIO._
import org.apache.commons.lang3.exception.ExceptionUtils
import play.api.http.{HttpErrorHandler, Status}
import play.api.i18n.{Lang, MessagesApi}
import play.api.libs.json.Json
import play.api.mvc.{RequestHeader, Result, Results}
import play.api.routing.Router
import security.rules.{NotAllowedException, SecurityException}
import utils.BodyParseException

import scala.concurrent.Future
import scala.concurrent.Future.successful

@Singleton
class ErrorHandler @Inject()(
    messagesApi: MessagesApi,
    router: Provider[Router]
) extends HttpErrorHandler with Status with Results with SecuredErrorHandler with UnsecuredErrorHandler {

    override def onNotAuthenticated(implicit request: RequestHeader): Future[Result] = successful {
        Unauthorized(Json.toJson(
            Errors(Seq(SecurityError("Not authorized", "You must login")))
        ))
    }

    // 403 - Forbidden
    override def onNotAuthorized(implicit request: RequestHeader): Future[Result] = successful {
        Forbidden(Json.toJson(
            Errors(Seq(ReadError("ui.errors.unauthorized.title", "ui.errors.unauthorized.message")))
        ))
    }

    def onClientError(request: RequestHeader, statusCode: Int, message: String) = {
        successful(
            statusCode match {
                case NOT_FOUND => Redirect("/404", statusCode)
                case _ => Status(statusCode)("A client error occurred: " + message)
            }
        )
    }

    def onServerError(request: RequestHeader, exception: Throwable) = {
        implicit val lang: Lang = Lang("en")
        println(ExceptionUtils.getStackTrace(exception))
        successful {
            exception match {
                case e: BodyParseException =>
                    BadRequest(Json.toJson(
                        Errors(e.errors(messagesApi))
                    ))
                case _: SecurityException =>
                    Forbidden("")
                case _: NotAllowedException =>
                    MethodNotAllowed("")
                case _: IdentityNotFoundException =>
                    Unauthorized(Json.toJson(
                        Errors(Seq(ServerError("signin.failed", "signin.error.notfound").translate(messagesApi)))
                    ))
                case _: InvalidPasswordException =>
                    Unauthorized(Json.toJson(
                        Errors(Seq(ServerError("signin.failed", "signin.error.password").translate(messagesApi)))
                    ))
                case e: Throwable =>
                    InternalServerError(Json.toJson(Errors(List(ServerError("Server Error", e.getMessage.capitalize)))))
            }
        }
    }
}
