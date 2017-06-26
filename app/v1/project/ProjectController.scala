package v1.project

import javax.inject.Inject

import play.api.mvc._
import v1.ProjectIO._
import scala.concurrent.ExecutionContext

/**
 * Takes HTTP requests and produces JSON.
 */
class ProjectController @Inject() (repo: ProjectRepo)(implicit ec: ExecutionContext) extends Controller {


}
