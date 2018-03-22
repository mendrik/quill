package controllers

import com.mohiva.play.silhouette.api._
import javax.inject.Inject
import play.api.libs.json.Json
import play.api.mvc._
import security.{QuillEnv, SecurityRules}
import security.rules.ProjectOwner
import utils.Actions.secured
import v1.ProjectIO._
import v1.node.NodeService
import v1.project.ProjectService

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future.successful

class Project @Inject()(
  val projectService: ProjectService,
  val nodeService: NodeService,
  implicit val silhouette: Silhouette[QuillEnv],
  implicit val securityRules: SecurityRules,
  val cc: ControllerComponents
) extends AbstractController(cc) {

    def project(hash: String): Action[AnyContent] = secured { implicit request =>
        (for {
            _         <- securityRules.checkRules(request.identity, ProjectOwner(hash))
            Some(u)   <- successful(request.identity)
            project   <- projectService.findByHashAndUser(hash, u.id)
            structure <- nodeService.structureNodes(project.id)
            schema    <- nodeService.schemaNodes(project.id)
        } yield {
            Ok(Json.toJson(
                project.copy(structure = structure, schema = schema)
            ))
        })
        .fallbackTo(successful(Unauthorized))
    }

}
