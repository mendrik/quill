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

    interface Credentials {
        email?: string,
        password?: string
    }

    export interface Token {
        minutes: number,
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

        }

        @On({event: 'tap', selector: '.forgotpassword-action'})
        forgotPasswordClicked() {

        }

        @On({event: 'textchange', selector: 'input'})
        textChanged(ev: TextEvent, el: HTMLInputElement) {
            let bindTo = (ev.target as HTMLElement).closest('[bind]').getAttribute('bind')
            setDeepValue(this, bindTo, el.value)
        }

        @Template()
        loginPage() {
            return (`
            <scroll-pane class="grow">
            <div class="login">
                <tabs>
                  <div class="form-components" title="Login" icon="key" active>
                    <Text label="E-Mail" placeholder="john@freemail.com" icon="envelope-o" value="user1@mail.com" autofocus bind="credentials.email"></Text>
                    <Text label="Password" type="password" icon="lock" bind="credentials.password"></Text>
                    <div class="block has-text-right">
                         <a class="button is-primary login-action">Login</a>
                    </div>
                  </div>
                  <div class="form-components" title="Sign up" icon="pencil-square-o">
                    <Text label="First name" placeholder="John" type="text" icon="user-o" bind="signup.firstname"></Text>
                    <Text label="Last name" placeholder="Smith" type="text" icon="user-o" bind="signup.lastname"></Text>
                    <Text label="E-Mail" placeholder="john@freemail.com" icon="envelope-o" bind="signup.email"></Text>
                    <Text label="Password" type="text" icon="lock" bind="signup.password"></Text>
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
                    <Text label="Send instrictions to" placeholder="your e-mail" icon="envelope-o" bind="forgotPassword.email"></Text>
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
