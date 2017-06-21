package error

case class ReadError(field: String, message: String) extends Exception {}

case class ReadsErrors(errors: Seq[ReadError])
