val silhouetteVersion = "4.0.0"
val slickVersion = "3.2.0"
val playSlickVersion = "2.1.0"
val scVersion = "2.11.11"

name := """Quill"""
version := "1.0-SNAPSHOT"

lazy val root = (project in file("."))
    .enablePlugins(PlayScala)

scalaVersion := scVersion
autoScalaLibrary := true
sourceGenerators in Compile += slickGenerate.taskValue

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"
resolvers += Resolver.sonatypeRepo("releases")
resolvers += Resolver.sonatypeRepo("snapshots")

doc in Compile := target.map(_ / "none").value

libraryDependencies ++= Seq(
    filters,
    javaJdbc,
    specs2 % Test,
    "mysql" % "mysql-connector-java" % "latest.release",
    "org.scala-lang" % "scala-reflect" % scVersion,
    "com.typesafe.play" %% "play-slick" % playSlickVersion,
    "com.typesafe.slick" %% "slick" % slickVersion,
    "com.typesafe.slick" %% "slick-hikaricp" % slickVersion,
    "com.typesafe.slick" %% "slick-codegen" % slickVersion,
    "joda-time" % "joda-time" % "2.9.6",
    "org.joda" % "joda-convert" % "1.7",
    "com.typesafe.play" %% "play-mailer" % "5.0.0",
    "com.mohiva" %% "play-silhouette" % silhouetteVersion,
    "com.mohiva" %% "play-silhouette-password-bcrypt" % silhouetteVersion,
    "com.mohiva" %% "play-silhouette-crypto-jca" % silhouetteVersion,
    "com.mohiva" %% "play-silhouette-persistence" % silhouetteVersion,
    "org.specs2" %% "specs2-matcher-extra" % "3.8.5" % Test
)

scalacOptions ++= Seq(
    "-deprecation", // Emit warning and location for usages of deprecated APIs.
    "-feature", // Emit warning and location for usages of features that should be imported explicitly.
    "-unchecked", // Enable additional warnings where generated code depends on assumptions.
    "-Xfatal-warnings", // Fail the compilation if there are any warnings.
    "-Xlint", // Enable recommended additional warnings.
    "-Ywarn-adapted-args", // Warn if an argument list is modified to match the receiver.
    "-Ywarn-dead-code", // Warn when dead code is identified.
    "-Ywarn-inaccessible", // Warn about inaccessible types in method signatures.
    "-Ywarn-nullary-override", // Warn when non-nullary overrides nullary, e.g. def foo() over def foo.
    "-Ywarn-numeric-widen" // Warn when numerics are widened.
)

lazy val slickGenerate = taskKey[Seq[File]]("slick code generation")

slickGenerate := {
    val dbName = "quill"
    val userName = "quill"
    val password = "quill42"
    val url = s"jdbc:mysql://localhost:3306/$dbName?autoReconnect=true&useSSL=false&nullNamePatternMatchesAll=true"
    val jdbcDriver = "com.mysql.cj.jdbc.Driver"
    val slickDriver = "slick.jdbc.MySQLProfile"
    val targetPackageName = "database"
    val outputDir = ((sourceManaged in Compile).value).getPath // place generated files in sbt's managed sources folder
    val fname = outputDir + s"/$targetPackageName/Tables.scala"
    println(s"\nauto-generating slick source for database schema at $url...")
    println(s"output source file file: file://$fname\n")
    (runner in Compile).value.run("slick.codegen.SourceCodeGenerator", (dependencyClasspath in Compile).value.files, Array(slickDriver, jdbcDriver, url, outputDir, targetPackageName, userName, password), streams.value.log)
    Seq(file(fname))
}
