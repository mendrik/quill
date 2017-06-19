package utils

import slick.codegen.SourceCodeGenerator
import slick.model.Model

class CodeGenerator(model: Model) extends SourceCodeGenerator(model) {

    override def Table = new Table(_) {

        override def EntityType = new EntityType {
            override def caseClassFinal = false
        }
    }

}
