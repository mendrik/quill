package controllers

import com.mohiva.play.silhouette.api._
import javax.inject.Inject
import play.api.Configuration
import play.api.i18n.MessagesApi
import play.api.libs.json.{JsValue, Json}
import play.api.mvc._
import security.rules.{NodeOwner, NotChildNode, ProjectOwner}
import security.{QuillEnv, SecurityRules}
import utils.Actions.{secured, securedJson}
import utils.Implicits._
import v1.NodeIO._
import v1.generic.extensions.decodeHash
import v1.node._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Node @Inject()(
  override val messagesApi: MessagesApi,
  val nodeService: NodeService,
  implicit val lang: play.api.i18n.Lang,
  implicit val silhouette: Silhouette[QuillEnv],
  implicit val securityRules: SecurityRules,
  implicit val parser: BodyParser[JsValue],
  val configuration: Configuration
) extends InjectedController {

    def newNodeName: String = messagesApi.translate("node.default-name", Nil).get

    def createStructureNode(hash: String): Action[JsValue] = securedJson[NewNode](
        Some("new-node"), ProjectOwner(hash)) { (node, request) =>
            for {
                Some(projectId) <- decodeHash(hash)
                newNode         <- Future.successful(Node(0, projectId, node.name, Structure, StringType, node.sort, Nil))
                Some(node)      <- nodeService.createNode(newNode, None)
            } yield {
                Ok(Json.toJson(node))
            }
    }

    def moveNode(nodeId: Long, targetId: Long): Action[JsValue] = securedJson[MoveNode](
        Some("new-node"), NodeOwner(nodeId), NotChildNode(nodeId, targetId)) { (move, request) =>
            nodeService.moveNode(nodeId, targetId, move)
                .flatMap(_ => Ok(""))
    }

    def createSchemaNode(hash: String): Action[AnyContent] = secured(
        ProjectOwner(hash)) { implicit request =>
            Ok(Json.toJson(""))
    }

    def createChildNode(parentNodeId: Long): Action[JsValue] = securedJson[NewNode](
        Some("new-child-node"), NodeOwner(parentNodeId)) { (node, request) =>
            for {
                Some(target)    <- nodeService.byId(parentNodeId)
                newNode         <- Future.successful(Node(0, target.project, node.name, Structure, StringType, node.sort, Nil))
                Some(node)      <- nodeService.createNode(newNode, Some(parentNodeId))
            } yield {
                Ok(Json.toJson(node))
            }
    }

    def deleteNode(nodeId: Long): Action[AnyContent] = secured(
        NodeOwner(nodeId)) { implicit request =>
            nodeService.deleteNode(nodeId)
                .flatMap(_ => Ok(""))
    }

    def renameNode(nodeId: Long): Action[JsValue] = securedJson[RenameNode](
        Some("rename-node")) { (node, request) =>
            nodeService.renameNode(nodeId, node.name)
                .flatMap(_ => Ok(""))
    }
}
