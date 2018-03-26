package controllers

import com.mohiva.play.silhouette.api._
import javax.inject.Inject
import play.api.libs.json.Json
import play.api.mvc._
import security.rules.VersionOwner
import security.{QuillEnv, SecurityRules}
import utils.Actions.secured
import v1.value.ValueService
import v1.version.VersionService
import v1.ValueIO._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future.successful

class Value @Inject()(
  val valueService: ValueService,
  val versionService: VersionService,
  implicit val silhouette: Silhouette[QuillEnv],
  implicit val securityRules: SecurityRules,
  val cc: ControllerComponents
) extends AbstractController(cc) {

    def valuesForVersion(versionId: Long): Action[AnyContent] = secured { implicit request =>
        (for {
            _             <- securityRules.checkRules(request.identity, VersionOwner(versionId))
            Some(version) <- versionService.getById(versionId)
            values        <- valueService.getByVersion(version)
        } yield {
            Ok(Json.toJson(values))
        })
        .fallbackTo(successful(Unauthorized))
    }
}
