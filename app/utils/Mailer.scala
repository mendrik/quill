package utils

import javax.inject.{Inject, Singleton}

import play.api.i18n.{Lang, MessagesApi}
import play.api.libs.mailer.{Email, MailerClient}
import play.twirl.api.Html

@Singleton
class Mailer @Inject()(
    ms: MailerClient,
    messages: MessagesApi
) {

    implicit def html2String(html: Html): String = html.toString

    def forgotPassword(toEmail: String, link: String)(implicit lang: Lang) {
        val title = messages.translate("email.forgot-password.title", Nil).get
        val message = messages.translate("email.forgot-password.message", Seq(link))
        val email = Email(title, "noreply@json.services", List(toEmail), message)
        ms.send(email)
    }

}
