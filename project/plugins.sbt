resolvers += "Flyway" at "https://flywaydb.org/repo"
resolvers += "Flyway2" at "https://davidmweber.github.io/flyway-sbt.repo"

addSbtPlugin("io.github.davidmweber" % "flyway-sbt" % "5.0.0-RC2")
addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.6.12")
addSbtPlugin("com.github.tototoshi" % "sbt-slick-codegen" % "1.3.0")

libraryDependencies += "org.postgresql" % "postgresql" % "42.2.2"
