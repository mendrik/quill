package security

import com.google.inject.{AbstractModule, Provides}
import com.mohiva.play.silhouette.api.actions.SecuredErrorHandler
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.api.services.AuthenticatorService
import com.mohiva.play.silhouette.api.util._
import com.mohiva.play.silhouette.api.{Environment, EventBus, Silhouette, SilhouetteProvider}
import com.mohiva.play.silhouette.impl.authenticators._
import com.mohiva.play.silhouette.impl.providers.CredentialsProvider
import com.mohiva.play.silhouette.impl.util.{DefaultFingerprintGenerator, SecureRandomIDGenerator}
import com.mohiva.play.silhouette.password.BCryptPasswordHasher
import com.mohiva.play.silhouette.persistence.daos.DelegableAuthInfoDAO
import com.mohiva.play.silhouette.persistence.repositories.DelegableAuthInfoRepository
import error.ErrorHandler
import net.codingwell.scalaguice.ScalaModule
import play.api.Configuration
import v1.user.UserService

import scala.concurrent.ExecutionContext.Implicits.global

class Module extends AbstractModule with ScalaModule {

    def configure(): Unit = {
        bind[MailTokenService[MailTokenUser]].to[MailTokenUserService]
        bind[SecuredErrorHandler].to[ErrorHandler]
        bind[DelegableAuthInfoDAO[PasswordInfo]].to[SecurityService]
        bind[Silhouette[QuillEnv]].to[SilhouetteProvider[QuillEnv]]
        bind[IDGenerator].toInstance(new SecureRandomIDGenerator())
        bind[PasswordHasher].toInstance(new BCryptPasswordHasher())
        bind[FingerprintGenerator].toInstance(new DefaultFingerprintGenerator(false))
        bind[EventBus].toInstance(EventBus())
        bind[Clock].toInstance(Clock())
    }

    @Provides
    def provideEnvironment(
        userService: UserService,
        authenticatorService: AuthenticatorService[BearerTokenAuthenticator],
        eventBus: EventBus): Environment[QuillEnv] = {

        Environment[QuillEnv](
            userService,
            authenticatorService,
            Seq(),
            eventBus
        )
    }

    @Provides
    def provideAuthenticatorService(
         securityService: SecurityService,
         idGenerator: IDGenerator,
         configuration: Configuration,
         clock: Clock): AuthenticatorService[BearerTokenAuthenticator] = {

        val config: BearerTokenAuthenticatorSettings = BearerTokenAuthenticatorSettings()
        new BearerTokenAuthenticatorService(config, securityService, idGenerator, clock)
    }

    @Provides
    def provideCredentialsProvider(
        authInfoRepository: AuthInfoRepository,
        passwordHasherRegistry: PasswordHasherRegistry): CredentialsProvider = {

        new CredentialsProvider(authInfoRepository, passwordHasherRegistry)
    }

    @Provides
    def provideAuthInfoRepository(
        passwordInfoDAO: DelegableAuthInfoDAO[PasswordInfo]): AuthInfoRepository = {
        new DelegableAuthInfoRepository(passwordInfoDAO)
    }

    @Provides
    def providePasswordHasherRegistry(passwordHasher: PasswordHasher): PasswordHasherRegistry = {
        PasswordHasherRegistry(passwordHasher)
    }

}
