package error

import play.api.i18n.MessagesApi

trait Error {
    def errorType: String
    def title: String
    def message: String

    def translate(messagesApi: MessagesApi): SecurityError = SecurityError(
        messagesApi.translate(title, Nil).getOrElse(title),
        messagesApi.translate(message, Nil).getOrElse(message)
    )

}

case class ReadError(field: String, message: String) extends Error {
    override def errorType = "validation"
    override def title: String = field
}

case class ServerError(title: String, message: String) extends Error {
    override def errorType = "error"
}

case class SecurityError(title: String, message: String) extends Error {

    override def errorType = "security"
}

case class Errors(errors: Seq[Error])
