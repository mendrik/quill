val databaseUrl = System.getenv("DB_QUILL_URL")
val databaseUser = System.getenv("DB_QUILL_USER")
val databasePassword = System.getenv("DB_QUILL_PASSWORD")

libraryDependencies += "org.flywaydb" % "flyway-core" % "5.0.7"
enablePlugins(FlywayPlugin)

name := "flyway"
version := "0.0.1"

libraryDependencies ++= Seq(
    "org.postgresql" % "postgresql" % "42.2.2",
    "org.flywaydb" % "flyway-core" % "5.0.7"
)

enablePlugins(FlywayPlugin)

flywayLocations += "db/migration"
flywayUrl := databaseUrl
flywayUser := databaseUser
flywayPassword := databasePassword
