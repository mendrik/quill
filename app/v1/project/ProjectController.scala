package v1.project

import javax.inject.Inject

import play.api.mvc._

import scala.concurrent.ExecutionContext

/**
 * Takes HTTP requests and produces JSON.
 */
class ProjectController @Inject() (repo: ProjectRepo)(implicit ec: ExecutionContext) extends Controller {

  def create() = Action(parse.json) { implicit request =>
    request.body.validate[CreateProject].fold(
      error => InternalServerError("JSON did not validate."),
      project => {
     //   repo.save(Project(None, project.name))
        Ok("all good ")
      }
    )
  }

}
