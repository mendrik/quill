package error

trait Error {
    def errorType: String
    def title: String
    def message: String
}

case class ReadError(field: String, message: String) extends Exception with Error {
    override def errorType = "validation"
    override def title: String = field
}

case class ServerError(title: String, message: String) extends Exception with Error {
    override def errorType = "error"
}

case class Errors(errors: Seq[Error])
