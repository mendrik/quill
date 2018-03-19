package controllers

import javax.inject.Inject
import com.mohiva.play.silhouette.api._
import play.api.Configuration
import play.api.i18n.MessagesApi
import play.api.libs.json.Json
import play.api.mvc._
import security.{QuillEnv, SecurityRules}
import security.rules.{NodeOwner, ProjectOwner}
import utils.Actions
import utils.Implicits._
import v1.generic.extensions.decodeHash
import v1.node._
import v1.NodeIO._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Node @Inject()(
  val messagesApi: MessagesApi,
  val nodeService: NodeService,
  implicit val silhouette: Silhouette[QuillEnv],
  implicit val securityRules: SecurityRules,
  val configuration: Configuration
) extends Controller {

    def newNodeName = messagesApi.translate("node.default-name", Nil).get

    def createStructureNode(hash: String) = Actions.securedJson[NewNode](
        Some("new-node"), ProjectOwner(hash)) { (node, request) =>
            val newNode = Node(0, node.name, Structure, StringType, node.sort, Nil)
            for {
                Some(id)   <- decodeHash(hash)
                Some(node) <- nodeService.createNode(id, newNode, None)
            } yield {
                Ok(Json.toJson(node))
            }
    }

    def createSchemaNode(hash: String) = Actions.secured(ProjectOwner(hash)) { implicit request =>
        Ok(Json.toJson(""))
    }

    def createChildNode(hash: String, parentNodeId: Long) = Actions.securedJson[NewNode](
        Some("new-child-node"), ProjectOwner(hash), NodeOwner(parentNodeId)) { (node, request) =>
            val newNode = Node(0, node.name, Structure, StringType, node.sort, Nil)
            for {
                Some(id)   <- decodeHash(hash)
                Some(node) <- nodeService.createNode(id, newNode, Some(parentNodeId))
            } yield {
                Ok(Json.toJson(node))
            }
    }

    def deleteNode(projectHash: String, nodeId: Long) = Actions.secured(NodeOwner(nodeId)) { implicit request =>
        nodeService.deleteNode(nodeId).flatMap(_ => Ok(""))
    }

    def renameNode(projectHash: String, nodeId: Long) = Actions.securedJson[RenameNode](Some("rename-node")) {
        (node, request) =>
            nodeService.renameNode(nodeId, node.name).flatMap(_ => Ok(""))
    }
}
