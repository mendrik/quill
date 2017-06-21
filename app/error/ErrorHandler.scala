package error

import java.sql.SQLIntegrityConstraintViolationException
import javax.inject._

import play.api.http.{HttpErrorHandler, Status}
import play.api.i18n.{Lang, MessagesApi}
import play.api.libs.json.Json
import play.api.mvc.{RequestHeader, Results}
import utils.BodyParseException

import scala.concurrent.Future

@Singleton
class ErrorHandler @Inject()(
    messagesApi: MessagesApi,
    error: ErrorIO
) extends HttpErrorHandler with Status with Results {

    import error._

    def onClientError(request: RequestHeader, statusCode: Int, message: String) = {
        Future.successful(
            Status(statusCode)("A client error occurred: " + message)
        )
    }

    def onServerError(request: RequestHeader, exception: Throwable) = {
        Future.successful(exception match {
            case e: SQLIntegrityConstraintViolationException if e.getMessage.contains("users_email_uindex") =>
                BadRequest(Json.toJson(
                    ReadsErrors(Seq(ReadError("signup.email", "validation.email.exists")))))
            case e: BodyParseException =>
                BadRequest(Json.toJson(
                    ReadsErrors(e.errors(messagesApi))
                ))
            case e: Throwable =>
                InternalServerError(s"A server error[${e.getClass.getName}] occurred: " + exception.getMessage)
        })
    }
}
