name := """Quill"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.11"

scalacOptions ++= Seq("-feature", "-deprecation", "-unchecked", "-language:reflectiveCalls", "-language:postfixOps", "-language:implicitConversions")

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

doc in Compile <<= target.map(_ / "none")

scalariformSettings

libraryDependencies ++= Seq(
    filters,
    "mysql" % "mysql-connector-java" % "5.1.34",
    "com.typesafe.slick" %% "slick" % "3.2.0",
    "com.typesafe.slick" %% "slick-codegen" % "3.2.0",
    "com.typesafe.slick" %% "slick-hikaricp" % "3.2.0",
    "io.strongtyped" %% "active-slick" % "0.3.5",
    "joda-time" % "joda-time" % "2.9.6",
    "com.typesafe.play" %% "play-mailer" % "5.0.0",
    specs2 % Test,
	"org.specs2" %% "specs2-matcher-extra" % "3.8.5" % Test
)

