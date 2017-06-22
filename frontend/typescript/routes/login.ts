module quill {

    import Construct = feather.annotations.Construct
    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe
    import On = feather.event.On
    import Rest = feather.xhr.Rest
    import Method = feather.xhr.Method
    import Theme = feather.ui.toast.Theme
    import AjaxForm = quill.components.AjaxForm
    import Translate = quill.components.Translate
    import Toast = feather.ui.toast.Toast
    import ToastManager = feather.ui.toast.ToastManager

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
        email?: string
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

        @Rest({url: '/signin', method: Method.POST, body: 'credentials', headers: quill.headers})
        doLogin(token?: Token) {
            this.route('/')
            Progress.stop()
        }

        @Subscribe('xhr-failure-401')
        unauthorized(err: Errors, xhr) {
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
        doSignup(resp?: Token) {
            Progress.stop()
        }

        @On({event: 'tap', selector: '.forgotpassword-action'})
        forgotPasswordClicked() {

        }

        @Template('default', false)
        loginPage() {
            return Translate.translate(`
            <scroll-pane class="grow">
            <div class="login">
                <tabs>
                  <div class="form-components" title="•ui.login.tabs.login" icon="key" active>
                    <Text label="•ui.signin.identifier" name="signin.identifier" placeholder="john@freemail.com" icon="envelope-o" autofocus bind="credentials.identifier"></Text>
                    <Text label="•ui.signin.password" name="signin.password" type="password" icon="lock" bind="credentials.password"></Text>
                    <div class="block has-text-right">
                         <a class="button is-primary login-action">•ui.signin.button</a>
                    </div>
                  </div>
                  <div class="form-components" title="•ui.login.tabs.signup" icon="pencil-square-o">
                    <Text label="•ui.signup.firstname" name="signup.firstname" placeholder="John" type="text" icon="user-o" bind="signup.firstname"></Text>
                    <Text label="•ui.signup.lastname" name="signup.lastname" placeholder="Smith" type="text" icon="user-o" bind="signup.lastname"></Text>
                    <Text label="•ui.signup.email" name="signup.email" placeholder="john@freemail.com" icon="envelope-o" bind="signup.email"></Text>
                    <Text label="•ui.signup.password" name="signup.password" type="text" icon="lock" bind="signup.password"></Text>
                    <div class="block has-text-right">
                         <a class="button is-primary signup-action">•ui.signup.button</a>
                    </div>
                  </div>
                  <div class="form-components" title="•ui.login.tabs.forgot-password" icon="unlock">
                    <p><Translate key="ui.forgot-password.info"/></p>
                    <Text label="•ui.forgot-password.email" name="forgot-password.email"  placeholder="your e-mail" icon="envelope-o" bind="forgotPassword.email"></Text>
                    <div class="block has-text-right">
                         <a class="button is-primary forgotpassword-action">•ui.forgot-password.button</a>
                    </div>
                  </div>
              </tabs>
            </div>
            </scroll-pane>
            `)
        }
    }
}
