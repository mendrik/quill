module quill {

    import Widget = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe
    import TreeNode = feather.ui.tree.TreeNode

    export class LoginPage extends Widget {

        @Template()
        loginPage() {
            return (`
            <scroll-pane class="grow">
            <div class="login">
                <tabs>
                  <div class="form-components" title="Login" icon="key" active>
                    <Text label="E-Mail" placeholder="john@freemail.com" icon="envelope-o" autofocus></Text>
                    <Text label="Password" type="password" icon="lock"></Text>
                    <div class="block has-text-right">
                         <a class="button is-primary">Login</a>
                    </div>
                  </div>
                  <div class="form-components" title="Sign up" icon="pencil-square-o">
                    <Text label="First name" type="text" icon="user-o"></Text>
                    <Text label="Last name" type="text" icon="user-o"></Text>
                    <Text label="E-Mail" placeholder="john@freemail.com" icon="envelope-o"></Text>
                    <Text label="Password" type="text" icon="lock"></Text>
                    <div class="block has-text-right">
                         <a class="button is-primary">Sign up</a>
                    </div>
                  </div>
                  <div class="form-components" title="Unlock" icon="unlock">
                    <p>
                        If you have forgotten your password fill in your e-mail below
                        and we will send you further instructions. If you need
                        additional help, feel free to contact us at <a href="mailto:help@json.services">help@json.services</a>.
                    </p>
                    <Text label="Send instrictions to" placeholder="your e-mail" icon="envelope-o"></Text>
                    <div class="block has-text-right">
                         <a class="button is-primary">Request</a>
                    </div>
                  </div>
              </tabs>
            </div>
            </scroll-pane>
            `)
        }
    }
}
