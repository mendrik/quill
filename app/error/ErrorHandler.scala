package error

import java.sql.SQLIntegrityConstraintViolationException
import javax.inject._

import com.mohiva.play.silhouette.api.actions.{SecuredErrorHandler, UnsecuredErrorHandler}
import controllers.routes
import play.api.http.{HttpErrorHandler, Status}
import play.api.i18n.{Lang, MessagesApi}
import play.api.libs.json.Json
import play.api.mvc.Results.{Forbidden, Redirect}
import play.api.mvc.{RequestHeader, Result, Results}
import play.api.routing.Router
import utils.BodyParseException

import scala.concurrent.Future

@Singleton
class ErrorHandler @Inject()(
    messagesApi: MessagesApi,
    error: ErrorIO,
    router: Provider[Router]
) extends HttpErrorHandler with Status with Results with SecuredErrorHandler with UnsecuredErrorHandler {

    import error._

    override def onNotAuthenticated(implicit request: RequestHeader): Future[Result] = Future.successful {
        Redirect(routes.Security.signIn())
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
            case e: SQLIntegrityConstraintViolationException if e.getMessage.contains("users_email_uindex") =>
                val emailExistsMessage = messagesApi.translate("validation.email.exists", Nil).getOrElse("")
                BadRequest(Json.toJson(
                    Errors(Seq(ReadError("signup.email", emailExistsMessage)))
                ))
            case e: BodyParseException =>
                BadRequest(Json.toJson(
                    Errors(e.errors(messagesApi))
                ))
            case e: Throwable =>
                InternalServerError(Json.toJson(Errors(List(ServerError("Server Error", e.getMessage.capitalize)))))
        })
    }
}
