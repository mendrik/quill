package error

import play.api.http.{HttpErrorHandler, Status}
import play.api.libs.json.Json
import play.api.mvc.{RequestHeader, Results}
import javax.inject._
import scala.concurrent.Future

@Singleton
class ErrorHandler @Inject()(error: ErrorIO) extends HttpErrorHandler with Status with Results {

    import error._
    
    def onClientError(request: RequestHeader, statusCode: Int, message: String) = {
        Future.successful(
            Status(statusCode)("A client error occurred: " + message)
        )
    }

    def onServerError(request: RequestHeader, exception: Throwable) = {
        Future.successful(exception match {
            case e: ValidationError =>
                BadRequest(Json.toJson(e))
            case _ =>
                InternalServerError("A server error occurred: " + exception.getMessage)
        })
    }
}
