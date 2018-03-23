module quill {

    import Template     = feather.annotations.Template
    import Bind         = feather.observe.Bind
    import Subscribe    = feather.hub.Subscribe
    import On           = feather.event.On
    import Rest         = feather.xhr.Rest
    import Method       = feather.xhr.Method
    import Theme        = feather.ui.toast.Theme
    import AjaxForm     = quill.components.AjaxForm
    import Toast        = feather.ui.toast.Toast
    import ToastManager = feather.ui.toast.ToastManager
    import TextInputConfig = feather.ui.TextInputConfig;

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

        @Rest({url: '/account/new-password', method: Method.PUT, body: 'newPassword', headers: quill.headers})
        doPasswordChange() {
            Progress.stop()
            this.route('/login')
            ToastManager.showToast(
                new Toast('ui.change-password.success.title', 'ui.change-password.success.message', Theme.Error)
            )
        }

        @Subscribe('xhr-failure-401')
        unauthorized(err: Errors, xhr) {
            Progress.stop()
            ToastManager.showToast(
                new Toast('ui.change-password.fail.title', 'ui.change-password.fail.message', Theme.Error)
            )
            this.route('/login')
        }

        @Template('default')
        loginPage() {
            return `
            <scroll-pane class="grow">
                <div class="change-password">
                  <p key="ui.change-password.info"/>
                  <div class="form-components">
                    <Text config="{passwordConfig}"/>
                    <Text config="{passwordRepeatConfig}"/>
                    <div class="block has-text-right">
                        <a class="button is-primary change-action" key="ui.change-password.button"/>
                    </div>
                  </div>
                </div>
            </scroll-pane>
            `
        }

        passwordConfig: TextInputConfig = {
            label: 'ui.change-password.password',
            name: 'new-password.password',
            icon: 'lock',
            type: 'password',
            onChange: (p: string) => this.newPassword.password = p
        }

        passwordRepeatConfig: TextInputConfig = {
            label: 'ui.change-password.password-repeat',
            name: 'new-password.passwordRepeat',
            icon: 'lock',
            type: 'password',
            onChange: (p: string) => this.newPassword.passwordRepeat = p
        }

    }
}
