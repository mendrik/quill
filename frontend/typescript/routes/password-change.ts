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
    import Scope = feather.event.Scope

    interface NewPassword {
        paddword?: string,
        passwordRepeat?: string
    }

    export class PassordChangePage extends AjaxForm {

        newPassword: NewPassword = {}

        @Bind() changePasswordInfo = 'ui.change-password.info'

        @On({event: 'tap', selector: '.change-action'})
        submitClicked() {
            Progress.start()
            this.doPasswordChange()
        }


        @Rest({url: '/changepassword', method: Method.POST, body: 'signup', headers: quill.headers})
        doPasswordChange() {
            Progress.stop()
            this.route('/')
        }


        @Template('default', false)
        loginPage() {
            return Translate.translate(`
            <scroll-pane class="grow">
                <div class="change-password">
                  <p><Translate key="ui.change-password.info"/></p>
                  <div class="form-components">
                    <Text label="•ui.change-password.password" name="change-password.password" placeholder="•ui.change-password.placeholder" icon="lock" autofocus bind="newPassword.password"></Text>
                    <Text label="•ui.change-password.password-repeat" name="change-password.password-repeat" type="password" icon="lock" bind="newPassword.passwordRepeat"></Text>
                    <div class="block has-text-right">
                         <a class="button is-primary change-action">•ui.change-password.button</a>
                    </div>
                  </div>
                </div>
            </scroll-pane>
            `)
        }
    }
}
