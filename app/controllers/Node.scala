package controllers

import javax.inject.Inject

import com.mohiva.play.silhouette.api._
import play.api.Configuration
import play.api.i18n.MessagesApi
import play.api.libs.json.Json
import play.api.mvc._
import security.QuillEnv
import utils.Implicits._
import v1.generic.extensions.decodeHash
import v1.node._
import v1.NodeIO._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Node @Inject()(
  val messagesApi: MessagesApi,
  val nodeService: NodeService,
  val silhouette: Silhouette[QuillEnv],
  val configuration: Configuration
) extends Controller {

    def newNodeName = messagesApi.translate("node.default-name", Nil).get

    def createStructureNode(hash: String) = silhouette.SecuredAction.async { implicit request =>
        val newNode = Node(0, newNodeName, StringType, Structure, Nil)
        for {
            Some(id) <- Future.successful(decodeHash(hash))
            Some(node) <- nodeService.createNode(id, newNode, None)
        } yield {
            Ok(Json.toJson(node))
        }
    }

    def createSchemaNode(hash: String) = silhouette.SecuredAction.async { implicit request =>
        Ok(Json.toJson(""))
    }

    def createChildNode(hash: String, parent: Long) = silhouette.SecuredAction.async { implicit request =>
        Ok(Json.toJson(""))
    }
}
