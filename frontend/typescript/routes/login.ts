module quill {

    import Construct = feather.annotations.Construct
    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe
    import TreeNode = feather.ui.tree.TreeNode
    import On = feather.event.On
    import Rest = feather.xhr.Rest
    import Method = feather.xhr.Method
    import GestureWidget = feather.ui.events.GestureWidget
    import setDeepValue = feather.objects.setDeepValue
    import ToastManager = feather.ui.toast.ToastManager
    import Toast = feather.ui.toast.Toast
    import Theme = feather.ui.toast.Theme

    interface Credentials {
        email?: string,
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

    export class LoginPage extends GestureWidget {

        credentials: Credentials = {
            email: 'user1@mail.com',
            password: '123456'
        }
        signup: Signup = {}
        forgotPassword: ForgotPassword = {}

        @On({event: 'tap', selector: '.login-action'})
        loginClicked() {
            this.doLogin()
        }

        @Rest({url: '/signin', method: Method.POST, body: 'credentials', headers: quill.headers})
        doLogin(token?: Token) {
            setToken(token)
            this.route('/')
        }

        @On({event: 'tap', selector: '.signup-action'})
        signupClicked() {
            this.triggerDown('field-error-clear')
            this.doSignup()
        }

        @Rest({url: '/signup', method: Method.POST, body: 'signup', headers: quill.headers})
        doSignup(resp?: Token) {
            console.log(resp)
        }

        @Subscribe('xhr-failure-400')
        requestFailed(err: Error[], xhr) {
            const messages = err.map(e => {
                if (e.type === 'validation') {
                    this.triggerDown('field-error', e.field)
                }
                e.message
            })
            ToastManager.showToast(new Toast("Sign up failed", messages.join('<br>'), Theme.Warning))
        }

        @On({event: 'tap', selector: '.forgotpassword-action'})
        forgotPasswordClicked() {

        }

        @On({event: 'textchange', selector: 'input'})
        textChanged(ev: TextEvent, el: HTMLInputElement) {
            let closest = (ev.target as HTMLElement).closest('[bind]')
            if (closest) {
                setDeepValue(this, closest.getAttribute('bind'), el.value)
            }
        }

        @Template()
        loginPage() {
            return (`
            <scroll-pane class="grow">
            <div class="login">
                <tabs>
                  <div class="form-components" title="Login" icon="key" active>
                    <Text label="E-Mail" name="login.email" placeholder="john@freemail.com" icon="envelope-o" value="user1@mail.com" autofocus bind="credentials.email"></Text>
                    <Text label="Password" name="login.password" type="password" icon="lock" value="123456" bind="credentials.password"></Text>
                    <div class="block has-text-right">
                         <a class="button is-primary login-action">Login</a>
                    </div>
                  </div>
                  <div class="form-components" title="Sign up" icon="pencil-square-o">
                    <Text label="First name" name="signup.firstname" placeholder="John" type="text" icon="user-o" bind="signup.firstName"></Text>
                    <Text label="Last name" name="signup.lastname" placeholder="Smith" type="text" icon="user-o" bind="signup.lastName"></Text>
                    <Text label="E-Mail" name="signup.email" placeholder="john@freemail.com" icon="envelope-o" bind="signup.email"></Text>
                    <Text label="Password" name="signup.password" type="text" icon="lock" bind="signup.password"></Text>
                    <div class="block has-text-right">
                         <a class="button is-primary signup-action">Sign up</a>
                    </div>
                  </div>
                  <div class="form-components" title="Unlock" icon="unlock">
                    <p>
                        If you have forgotten your password fill in your e-mail below
                        and we will send you further instructions. If you need
                        additional help, feel free to contact us at <a href="mailto:help@json.services">help@json.services</a>.
                    </p>
                    <Text label="Send instrictions to" name="forgot-password.email"  placeholder="your e-mail" icon="envelope-o" bind="forgotPassword.email"></Text>
                    <div class="block has-text-right">
                         <a class="button is-primary forgotpassword-action">Request</a>
                    </div>
                  </div>
              </tabs>
            </div>
            </scroll-pane>
            `)
        }
    }
}
