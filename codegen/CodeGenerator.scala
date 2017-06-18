package utils

import slick.codegen.SourceCodeGenerator
import slick.codegen.SourceCodeGenerator.run
import slick.jdbc.JdbcProfile
import slick.model.Model

import scala.concurrent.duration.Duration
import scala.concurrent.{Await, ExecutionContext}

class CodeGenerator(model: slick.model.Model) extends SourceCodeGenerator(model) {

    override def Table = new Table(_) {

        override def EntityType = new EntityType {
            override def caseClassFinal = false
        }
    }

}
