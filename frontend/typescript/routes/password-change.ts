module quill {

    import Template     = feather.annotations.Template
    import Bind         = feather.observe.Bind
    import Subscribe    = feather.hub.Subscribe
    import On           = feather.event.On
    import Rest         = feather.xhr.Rest
    import Method       = feather.xhr.Method
    import Theme        = feather.ui.toast.Theme
    import AjaxForm     = quill.components.AjaxForm
    import Translate    = quill.components.Translate
    import Toast        = feather.ui.toast.Toast
    import ToastManager = feather.ui.toast.ToastManager

    interface NewPassword {
        id: string,
        password?: string,
        passwordRepeat?: string
    }

    export class PassordChangePage extends AjaxForm {

        newPassword: NewPassword = {
            id: quill.getQueryStringParam('id')
        }

        @Bind() changePasswordInfo = 'ui.change-password.info'

        init() {
            removeToken();
        }

        @On({event: 'tap', selector: '.change-action'})
        submitClicked() {
            Progress.start()
            this.doPasswordChange()
        }

        @Rest({url: '/account/password', method: Method.PUT, body: 'newPassword', headers: quill.headers})
        doPasswordChange() {
            Progress.stop()
            this.route('/login')
            const title = Translate.translations['ui.change-password.success.title']
            const message = Translate.translations['ui.change-password.success.message']
            ToastManager.showToast(new Toast(title, message, Theme.Error))
        }

        @Subscribe('xhr-failure-401')
        unauthorized(err: Errors, xhr) {
            Progress.stop()
            const title = Translate.translations['ui.change-password.fail.title']
            const message = Translate.translations['ui.change-password.fail.message']
            ToastManager.showToast(new Toast(title, message, Theme.Error))
            this.route('/login')
        }

        @Template('default')
        loginPage() {
            return `
            <scroll-pane class="grow">
                <div class="change-password">
                  <p><Translate key="ui.change-password.info"/></p>
                  <div class="form-components">
                    <Text label="ui.change-password.password"
                          name="change-password.password"
                          placeholder="ui.change-password.placeholder"
                          type="password"
                          icon="lock"
                          autofocus
                          bind="newPassword.password"></Text>
                    <Text label="ui.change-password.password-repeat"
                          name="change-password.password-repeat"
                          type="password"
                          icon="lock"
                          bind="newPassword.passwordRepeat"></Text>
                    <div class="block has-text-right">
                         <a class="button is-primary change-action">
                            <translate key="ui.change-password.button"/>
                        </a>
                    </div>
                  </div>
                </div>
            </scroll-pane>
            `
        }
    }
}
