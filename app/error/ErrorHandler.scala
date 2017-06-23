package error

import javax.inject._

import com.mohiva.play.silhouette.api.actions.{SecuredErrorHandler, UnsecuredErrorHandler}
import com.mohiva.play.silhouette.impl.exceptions.IdentityNotFoundException
import controllers.routes
import error.ErrorIO._
import play.api.http.{HttpErrorHandler, Status}
import play.api.i18n.MessagesApi
import play.api.libs.json.Json
import play.api.mvc.{RequestHeader, Result, Results}
import play.api.routing.Router
import utils.BodyParseException

import scala.concurrent.Future

@Singleton
class ErrorHandler @Inject()(
    messagesApi: MessagesApi,
    router: Provider[Router]
) extends HttpErrorHandler with Status with Results with SecuredErrorHandler with UnsecuredErrorHandler {

    override def onNotAuthenticated(implicit request: RequestHeader): Future[Result] = Future.successful {
        Unauthorized(Json.toJson(
            Errors(Seq(SecurityError("Not authorized", "You must login")))
        ))
    }

    // 403 - Forbidden
    override def onNotAuthorized(implicit request: RequestHeader): Future[Result] = Future.successful {
        Forbidden(Json.toJson(Errors(Seq(ReadError("errors.unauthorized", "errors.unauthorized.message")))))
    }

    def onClientError(request: RequestHeader, statusCode: Int, message: String) = {
        Future.successful(
            Status(statusCode)("A client error occurred: " + message)
        )
    }

    def onServerError(request: RequestHeader, exception: Throwable) = {
        Future.successful(exception match {
            case e: BodyParseException =>
                BadRequest(Json.toJson(
                    Errors(e.errors(messagesApi))
                ))
            case e: IdentityNotFoundException =>
                val title = messagesApi.translate("signin.failed", Nil).getOrElse("")
                val userNotFound = messagesApi.translate("signin.error.notfound", Nil).getOrElse("")
                Unauthorized(Json.toJson(
                    Errors(Seq(ServerError(title, userNotFound)))
                ))
            case e: Throwable =>
                InternalServerError(Json.toJson(Errors(List(ServerError("Server Error", e.getMessage.capitalize)))))
        })
    }
}
