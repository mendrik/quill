module quill.components {

    import Theme        = feather.ui.toast.Theme
    import ToastManager = feather.ui.toast.ToastManager
    import Toast        = feather.ui.toast.Toast
    import Subscribe    = feather.hub.Subscribe

    export class AjaxForm extends AjaxWidget {

        @Subscribe('xhr-failure-400')
        validationFailed(err: Errors) {
            Progress.stop()
            const messages = err.errors.map(e => {
                if (e.type === 'validation') {
                    this.triggerDown('field-error', e.title)
                }
                return e.message
            })
            if (err.errors.length) {
                const errorType = err.errors[0].title.split('.').shift()
                ToastManager.showToast(new Toast(`ui.${errorType}.failed`, messages, Theme.Warning))
            }
        }
    }
}
