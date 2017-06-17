package utils

import slick.codegen.SourceCodeGenerator
import slick.codegen.SourceCodeGenerator.run
import slick.jdbc.JdbcProfile
import slick.model.Model

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext}

class CodeGenerator(model: Model) extends SourceCodeGenerator(model) {

    override def Table = new Table(_) {

        override def EntityType = new EntityType {
            override def caseClassFinal = false
        }
    }

}

object CustomizedCodeGenerator {

    def run(profile: String, jdbcDriver: String, url: String, outputDir: String, pkg: String, user: Option[String], password: Option[String], ignoreInvalidDefaults: Boolean): Unit = {
        val profileInstance: JdbcProfile =
            Class.forName(profile + "$").getField("MODULE$").get(null).asInstanceOf[JdbcProfile]
        val dbFactory = profileInstance.api.Database
        val db = dbFactory.forURL(url, driver = jdbcDriver,
            user = user.getOrElse(null), password = password.getOrElse(null), keepAliveConnection = true)
        try {
            val m = Await.result(db.run(profileInstance.createModel(None, ignoreInvalidDefaults)(ExecutionContext.global).withPinnedSession), Duration.Inf)
            new CodeGenerator(m).writeToFile(profile,outputDir,pkg)
        } finally db.close
    }

    def main(args: Array[String]): Unit = {
        args.toList match {
            case profile :: jdbcDriver :: url :: outputDir :: pkg :: user :: password :: Nil =>
                run(profile, jdbcDriver, url, outputDir, pkg, Some(user), Some(password), true)
            case _ => {
                println(args)
                ()
            }
        }
    }
}
