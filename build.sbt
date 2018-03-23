val silhouetteVersion = "5.0.0"
val slickVersion = "3.2.2"
val playSlickVersion = "3.0.1"
val scVersion = "2.11.11"

name := """Quill"""
version := "1.0-SNAPSHOT"

scalaVersion := scVersion
autoScalaLibrary := true

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"
resolvers += "dl-john-ky" at "http://dl.john-ky.io/maven/releases"
resolvers += Resolver.sonatypeRepo("releases")
resolvers += Resolver.sonatypeRepo("snapshots")
resolvers += "Atlassian Releases" at "https://maven.atlassian.com/public/"

routesImport += "play.api.mvc.PathBindable._"
routesGenerator := InjectedRoutesGenerator

sources in (Compile, doc) := Seq.empty
publishArtifact in (Compile, packageDoc) := false

lazy val root = (project in file("."))
    .enablePlugins(PlayScala)
    .settings(sharedSettings)
    .settings(sourceGenerators in Compile += slickGenerate.taskValue)
    .dependsOn(codegen)

lazy val codegen = project
    .settings(sharedSettings)
    .settings(libraryDependencies += "com.typesafe.slick" %% "slick-codegen" % slickVersion)

lazy val sharedSettings = Seq(
    scalaVersion := scVersion,
    libraryDependencies ++= List(
        "com.typesafe.play" %% "play-slick" % playSlickVersion,
        "mysql" % "mysql-connector-java" % "latest.release",
        "org.scala-lang" % "scala-reflect" % scVersion,
        "com.typesafe.slick" %% "slick" % slickVersion,
        "com.typesafe.slick" %% "slick-hikaricp" % slickVersion,
        "joda-time" % "joda-time" % "2.9.9",
        "org.joda" % "joda-convert" % "1.8.1"
    )
)

libraryDependencies ++= Seq(
    guice,
    filters,
    javaJdbc,
    specs2 % Test,
    "com.typesafe.play" %% "play-json" % "2.6.7",
    "io.john-ky" %% "hashids-scala" % "1.1.2-2974446",
    "com.typesafe.play" %% "play-mailer" % "5.0.0",
    "com.mohiva" %% "play-silhouette" % silhouetteVersion,
    "com.mohiva" %% "play-silhouette-password-bcrypt" % silhouetteVersion,
    "com.mohiva" %% "play-silhouette-crypto-jca" % silhouetteVersion,
    "com.mohiva" %% "play-silhouette-persistence" % silhouetteVersion,
    "net.codingwell" %% "scala-guice" % "4.1.1",
    "org.scalaz" %% "scalaz-core" % "7.2.20",
    "org.specs2" %% "specs2-matcher-extra" % "3.8.5" % Test
)

scalacOptions ++= Seq(
    "-language:implicitConversions",
    "-language:postfixOps",
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
    val outputDir = (sourceManaged in Compile).value.getPath // place generated files in sbt's managed sources folder
    val fname = outputDir + s"/$targetPackageName/Tables.scala"
    // println(s"\nauto-generating slick source for database schema at $url...")
    // println(s"output source file file: file://$fname\n")
    (runner in Compile).value.run("slick.codegen.SourceCodeGenerator",
        (dependencyClasspath in Compile).value.files,
        Array(
            slickDriver,
            jdbcDriver,
            url,
            outputDir,
            targetPackageName,
            userName,
            password,
            "true",
            "utils.CodeGenerator"
        ),
        streams.value.log)
    Seq(file(fname))
}
