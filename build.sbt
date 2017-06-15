name := """Quill"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file("."))
    .enablePlugins(PlayScala)

scalaVersion := "2.11.11"
autoScalaLibrary := true

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

doc in Compile := target.map(_ / "none").value


libraryDependencies ++= Seq(
    filters,
    javaJdbc,
    specs2 % Test,
    "mysql" % "mysql-connector-java" % "5.1.42",
    "org.scala-lang" % "scala-reflect" % "2.11.11",
    "com.typesafe.play" %% "play-slick" % "2.1.0",
    "com.typesafe.slick" %% "slick" % "3.2.0",
    "com.typesafe.slick" %% "slick-hikaricp" % "3.2.0",
    "joda-time" % "joda-time" % "2.9.6",
    "org.joda" % "joda-convert" % "1.7",
    "com.typesafe.play" %% "play-mailer" % "5.0.0",
    "com.mohiva" %% "play-silhouette" % "4.0.0",
    "com.mohiva" %% "play-silhouette-password-bcrypt" % "4.0.0",
    "com.mohiva" %% "play-silhouette-crypto-jca" % "4.0.0",
    "com.mohiva" %% "play-silhouette-persistence" % "4.0.0",
    "com.mohiva" %% "play-silhouette-testkit" % "4.0.0" % "test",
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
