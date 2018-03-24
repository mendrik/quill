import play.sbt.routes.RoutesKeys.routesGenerator
import sbt.Keys.{resolvers, version}

val silhouetteVersion = "5.0.0"
val slickVersion = "3.2.2"
val playSlickVersion = "3.0.1"
val scVersion = "2.12.5"

val exRes = List(
    "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases",
    Resolver.sonatypeRepo("releases"),
    Resolver.sonatypeRepo("snapshots"),
    "Atlassian Releases" at "https://maven.atlassian.com/public/"
)

lazy val root = (project in file("."))
    .enablePlugins(PlayScala, CodegenPlugin)
    .settings(
        name := "Quill",
        version := "1.0-SNAPSHOT",
        autoScalaLibrary := true,
        resolvers ++= exRes,
        routesImport += "play.api.mvc.PathBindable._",
        routesGenerator := InjectedRoutesGenerator,
        scalacOptions ++= scalacOpts,
        libraryDependencies ++= dependencies,
        evictionWarningOptions in update := EvictionWarningOptions.default.withInfoAllEvictions(false),
        sharedSettings,
        codegenSettings
    )

lazy val sharedSettings = Seq(
    scalaVersion := scVersion,
    libraryDependencies ++= List(
        "org.postgresql" % "postgresql" % "9.4-1201-jdbc41",
        "org.scala-lang" % "scala-reflect" % scVersion,
        "com.typesafe.slick" %% "slick" % slickVersion,
        "com.typesafe.slick" %% "slick-hikaricp" % slickVersion,
        "com.typesafe.slick" %% "slick-codegen" % slickVersion,
        "joda-time" % "joda-time" % "2.9.9",
        "org.joda" % "joda-convert" % "1.8.1"
    )
)

lazy val dependencies = Seq(
    guice,
    filters,
    "com.typesafe.play" %% "play-slick" % playSlickVersion,
    "com.typesafe.play" %% "play-slick-evolutions" % "3.0.3",
    "com.typesafe.play" %% "play-json" % "2.6.7",
    "com.github.ancane" %% "hashids-scala" % "1.3",
    "com.typesafe.play" %% "play-mailer" % "6.0.1",
    "com.mohiva" %% "play-silhouette" % silhouetteVersion,
    "com.mohiva" %% "play-silhouette-password-bcrypt" % silhouetteVersion,
    "com.mohiva" %% "play-silhouette-crypto-jca" % silhouetteVersion,
    "com.mohiva" %% "play-silhouette-persistence" % silhouetteVersion,
    "net.codingwell" %% "scala-guice" % "4.1.0",
    "org.scalaz" %% "scalaz-core" % "7.2.20"
)

lazy val scalacOpts = Seq(
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
    "-Ywarn-numeric-widen", // Warn when numerics are widened.
    "-Ywarn-unused:-implicits,_"
)

lazy val codegenSettings = Seq(
    sourceGenerators in Compile += slickCodegen.taskValue,
    slickCodegenDatabaseUrl := "jdbc:postgresql://localhost/quill",
    slickCodegenDatabaseUser := "quill",
    slickCodegenDatabasePassword := "quill42",
    slickCodegenDriver := slick.jdbc.PostgresProfile,
    slickCodegenJdbcDriver := "org.postgresql.Driver",
    slickCodegenOutputPackage := "database",
    slickCodegenOutputDir := (sourceManaged in Compile).value
)
