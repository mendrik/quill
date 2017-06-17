package modules

import com.mohiva.play.silhouette.api.util._
import com.mohiva.play.silhouette.impl.util._
import com.mohiva.play.silhouette.password.BCryptPasswordHasher
import play.api.libs.concurrent.Execution.Implicits._
import play.api.{Configuration, Environment}

class Security extends play.api.inject.Module {

    override def bindings(environment: Environment, configuration: Configuration) = {
        Seq(
            bind[IDGenerator].toInstance(new SecureRandomIDGenerator()),
            bind[PasswordHasher].toInstance(new BCryptPasswordHasher())
        )
    }
}
