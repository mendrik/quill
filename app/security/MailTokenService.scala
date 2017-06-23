package security

import javax.inject.Inject

import scala.concurrent.Future

trait MailTokenService[T <: MailToken] {
    def create(token: T): Future[Option[T]]
    def retrieve(id: String): Future[Option[T]]
    def consume(id: String): Unit
}

class MailTokenUserService @Inject()(
    mailTokenRepo: MailTokenRepo
) extends MailTokenService[MailTokenUser] {

    def create(token: MailTokenUser): Future[Option[MailTokenUser]] = {
        mailTokenRepo.createMailToken(token)
    }

    def retrieve(id: String): Future[Option[MailTokenUser]] = {
        mailTokenRepo.findById(id)
    }

    def consume(id: String): Unit = {
        mailTokenRepo.remove(id)
    }
}
