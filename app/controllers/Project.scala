package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api._
import play.api.Configuration
import play.api.i18n.MessagesApi
import play.api.libs.json.Json
import play.api.mvc._
import security.QuillEnv
import utils.Implicits._
import v1.project.ProjectService
import v1.ProjectIO._
import v1.user._

import scala.concurrent.ExecutionContext.Implicits.global

class Project @Inject()(
  val messagesApi: MessagesApi,
  val projectService: ProjectService,
  val userService: UserService,
  val silhouette: Silhouette[QuillEnv],
  val configuration: Configuration
) extends Controller {

    def project(hash: String) = silhouette.SecuredAction.async { implicit request =>
        val user: User = request.identity
        (for {
            Some(project) <- projectService.findByHashAndUser(hash, user.id)
        } yield {
            Ok(Json.toJson(project))
        })
        .fallbackTo(Unauthorized)
    }

}