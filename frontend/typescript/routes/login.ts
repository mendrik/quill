module quill {

    import Template        = feather.annotations.Template
    import Bind            = feather.observe.Bind
    import Subscribe       = feather.hub.Subscribe
    import On              = feather.event.On
    import Rest            = feather.xhr.Rest
    import Method          = feather.xhr.Method
    import Theme           = feather.ui.toast.Theme
    import AjaxForm        = quill.components.AjaxForm
    import Toast           = feather.ui.toast.Toast
    import ToastManager    = feather.ui.toast.ToastManager
    import Scope           = feather.event.Scope
    import TextInputConfig = feather.ui.TextInputConfig

    interface Credentials {
        identifier?: string,
        password?: string
    }

    export interface Token {
        token: string
    }

    interface Signup {
        email?: string,
        password?: string
        firstname?: string
        lastname?: string
    }

    interface ForgotPassword {
        identifier?: string
    }

    export class LoginPage extends AjaxForm {

        credentials: Credentials = {}
        signup: Signup = {}
        forgotPassword: ForgotPassword = {}

        @Bind() forgotPasswordInfo = 'forgot-password.info'

        @On({event: 'tap', selector: '.login-action'})
        loginClicked() {
            Progress.start()
            this.doLogin()
        }

        @On({event: 'keypress', selector: 'input[type="password"]', scope: Scope.Direct})
        pressedEnter(ev: KeyboardEvent) {
            if (ev.keyCode === Keys.ENTER) {
                Progress.start()
                this.doLogin()
            }
        }

        @Rest({url: '/signin', method: Method.POST, body: 'credentials', headers: quill.headers})
        doLogin(token?: Token) {
            setToken(token)
            this.route('/ ')
            Progress.stop()
        }

        @Subscribe('xhr-failure-401')
        requestUnauthorized(err: Errors) {
            Progress.stop()
            ToastManager.showToast(new Toast(err.errors[0].title, err.errors[0].message, Theme.Error))
        }

        @On({event: 'tap', selector: '.signup-action'})
        signupClicked() {
            this.triggerDown('field-error-clear')
            Progress.start()
            this.doSignup()
        }

        @Rest({url: '/signup', method: Method.POST, body: 'signup', headers: quill.headers})
        doSignup(token?: Token) {
            setToken(token)
            Progress.stop()
            this.route('/')
        }

        @On({event: 'tap', selector: '.forgot-password-action'})
        forgotPasswordClicked() {
            Progress.start()
            this.requestPasswordChange()
        }

        @Rest({url: '/account', method: Method.PUT, body: 'forgotPassword', headers: quill.headers})
        requestPasswordChange() {
            Progress.stop()
            ToastManager.showToast(
                new Toast('ui.forgot-password.email-sent.title', 'ui.forgot-password.email-sent.message', Theme.Info)
            )
            this.route('/login')
        }

        identifierConfig: TextInputConfig = {
            label: 'ui.signin.identifier',
            name: 'signin.identifier',
            placeholder: 'john@freemail.com',
            icon: 'envelope-o',
            autofocus: true,
            onChange: (l: string) => this.credentials.identifier = l
        }

        passwordConfig: TextInputConfig = {
            label: 'ui.signin.password',
            name: 'signin.password',
            icon: 'lock',
            type: 'password',
            onChange: (p: string) => this.credentials.password = p
        }

        firstnameConfig = {
            label: 'ui.signup.firstname',
            icon: 'user-o',
            name: 'signup.firstname',
            placeholder: 'John',
            onChange: (p: string) => this.signup.firstname = p
        }

        lastnameConfig = {
            label: 'ui.signup.lastname',
            icon: 'user-o',
            name: 'signup.lastname',
            placeholder: 'Smith',
            onChange: (p: string) => this.signup.lastname = p
        }

        emailConfig = {
            label: 'ui.signup.email',
            name: 'signup.email',
            icon: 'envelope-o',
            placeholder: 'john@mail.com',
            onChange: (p: string) => this.signup.email = p
        }

        signupPasswordConfig = {
            label: 'ui.signup.password',
            name: 'signup.password',
            icon: 'lock',
            onChange: (p: string) => this.signup.password = p
        }

        forgotPasswordConfig = {
            label: 'ui.forgot-password.email',
            name: 'forgot-password.identifier',
            icon: 'envelope-o',
            onChange: (p: string) => this.forgotPassword.identifier = p
        }

        @Template('default')
        loginPage() {
            return `
            <scroll-pane class="grow">
                <div class="login">
                    <tabs>
                      <div class="form-components" title="ui.login.tabs.login" icon="key" active>
                        <Text config="{identifierConfig}"/>
                        <Text config="{passwordConfig}"/>
                        <div class="block has-text-right">
                            <a class="button is-primary login-action" key="ui.signin.button"/>
                        </div>
                      </div>
                      <div class="form-components" title="ui.login.tabs.signup" icon="pencil-square-o">
                        <Text config="{firstnameConfig}"/>
                        <Text config="{lastnameConfig}"/>
                        <Text config="{emailConfig}"/>
                        <Text config="{signupPasswordConfig}"/>
                        <div class="block has-text-right">
                             <a class="button is-primary signup-action" key="ui.signup.button"/>
                        </div>
                      </div>
                      <div class="form-components" title="ui.login.tabs.forgot-password" icon="unlock">
                        <html-fragment html-key="ui.forgot-password.info"/>
                        <Text config="{forgotPasswordConfig}"/>
                        <div class="block has-text-right">
                             <a class="button is-primary forgot-password-action" key="ui.forgot-password.button"/>
                        </div>
                      </div>
                  </tabs>
                </div>
            </scroll-pane>
            `
        }
    }
}
