package controllers

import com.mohiva.play.silhouette.api._
import javax.inject.Inject
import play.api.Configuration
import play.api.i18n.{Lang, MessagesApi}
import play.api.libs.json.{JsValue, Json}
import play.api.mvc._
import security.rules.{NodeOwner, NotChildNode, ProjectOwner}
import security.{QuillEnv, SecurityRules}
import utils.Actions.{secured, securedJson}
import v1.NodeIO._
import v1.generic.extensions.decodeHash
import v1.node._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class Node @Inject()(
  override val messagesApi: MessagesApi,
  val nodeService: NodeService,
  val cc: ControllerComponents,
  implicit val silhouette: Silhouette[QuillEnv],
  implicit val securityRules: SecurityRules,
  val configuration: Configuration
) extends AbstractController(cc) {

    implicit val lang: Lang = Lang("en")
    implicit val parser: BodyParser[JsValue] = this.parse.json

    def newNodeName: String = messagesApi.translate("node.default-name", Nil).get

    def createStructureNode(hash: String): Action[JsValue] = securedJson[NewNode] { (node, request) =>
        for {
            _               <- securityRules.checkRules(request.identity, ProjectOwner(hash))
            Some(projectId) <- decodeHash(hash)
            newNode         <- Future.successful(Node(0, projectId, node.name, Structure, StringType, node.sort, Nil))
            Some(node)      <- nodeService.createNode(newNode, None)
        } yield {
            Ok(Json.toJson(node))
        }
    }

    def moveNode(nodeId: Long, targetId: Long): Action[JsValue] = securedJson[MoveNode] { (move, request) =>
        for {
            _ <- securityRules.checkRules(request.identity, NodeOwner(nodeId), NodeOwner(targetId), NotChildNode(nodeId, targetId))
            _ <- nodeService.moveNode(nodeId, targetId, move)
        } yield {
            Ok("")
        }
    }

    def createSchemaNode(hash: String): Action[AnyContent] = secured { request =>
        for {
            _ <- securityRules.checkRules(request.identity, ProjectOwner(hash))
        } yield {
            Ok(Json.toJson(""))
        }
    }

    def createChildNode(parentNodeId: Long): Action[JsValue] = securedJson[NewNode] { (node, request) =>
        for {
            _            <- securityRules.checkRules(request.identity, NodeOwner(parentNodeId))
            Some(target) <- nodeService.byId(parentNodeId)
            newNode      <- Future.successful(Node(0, target.project, node.name, Structure, StringType, node.sort, Nil))
            Some(node)   <- nodeService.createNode(newNode, Some(parentNodeId))
        } yield {
            Ok(Json.toJson(node))
        }
    }

    def deleteNode(nodeId: Long): Action[AnyContent] = secured { request =>
        for {
            _ <- securityRules.checkRules(request.identity, NodeOwner(nodeId))
            _ <- nodeService.deleteNode(nodeId)
        } yield {
            Ok("")
        }
    }

    def renameNode(nodeId: Long): Action[JsValue] = securedJson[RenameNode] { (node, request) =>
        for {
            _ <- securityRules.checkRules(request.identity, NodeOwner(nodeId))
            _ <- nodeService.renameNode(nodeId, node.name)
        } yield {
            Ok("")
        }
    }
}
