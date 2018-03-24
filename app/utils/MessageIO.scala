package utils

import play.api.libs.json._

case class Message(key: String, value: String)

case class Messages(messages: List[Message])

package object MessageIO {

    implicit val messageWrites: OWrites[Message] = Json.writes[Message]
    
    implicit val messagesWrites: OWrites[Messages] = Json.writes[Messages]

}
