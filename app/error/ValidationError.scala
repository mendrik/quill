package error

case class ValidationError(field: String, messageKey: String) extends Exception {

}
