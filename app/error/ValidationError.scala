package error

case class ValidationError(field: String, messageKey: String) extends Exception {}

case class ValidationErrors(errors: Seq[ValidationError])
