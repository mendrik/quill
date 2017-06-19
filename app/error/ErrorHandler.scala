package error

import java.sql.SQLIntegrityConstraintViolationException
import javax.inject._

import play.api.http.{HttpErrorHandler, Status}
import play.api.libs.json.Json
import play.api.mvc.{RequestHeader, Results}
import utils.BodyParseException

import scala.concurrent.Future

@Singleton
class ErrorHandler @Inject()(
    error: ErrorIO
) extends HttpErrorHandler with Status with Results {

    def onClientError(request: RequestHeader, statusCode: Int, message: String) = {
        Future.successful(
            Status(statusCode)("A client error occurred: " + message)
        )
    }

    def onServerError(request: RequestHeader, exception: Throwable) = {
        Future.successful(exception match {
            case e: SQLIntegrityConstraintViolationException if e.getMessage.contains("users_email_uindex") =>
                BadRequest(Json.toJson(List(ValidationError("signup-email", "validation.email.exists"))))
            case e: BodyParseException =>
                BadRequest(Json.toJson(e.errors.map { case (path, errs) =>
                    ValidationError(path.path.head.toJsonString, errs.toString())
                }))
            case e: Throwable =>
                InternalServerError(s"A server error[${e.getClass.getName}] occurred: " + exception.getMessage)
        })
    }
}
