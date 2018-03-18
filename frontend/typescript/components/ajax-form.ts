module quill.components {

    import GestureWidget = feather.ui.events.GestureWidget
    import Theme = feather.ui.toast.Theme
    import ToastManager = feather.ui.toast.ToastManager
    import Toast = feather.ui.toast.Toast
    import Subscribe = feather.hub.Subscribe

    export class AjaxForm extends GestureWidget {

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

        @Subscribe('xhr-failure-500')
        requestFailed(err: Errors) {
            Progress.stop()
            ToastManager.showToast(new Toast('ui.error.server', err.errors[0].message, Theme.Error))
        }

        @Subscribe('xhr-failure-timeout')
        timeout() {
            Progress.stop()
            ToastManager.showToast(new Toast('ui.error.timeout.title', 'ui.error.timeout.message', Theme.Error))
        }

        @Subscribe('xhr-failure-error')
        genericError() {
            Progress.stop()
            ToastManager.showToast(new Toast('ui.error.generic.title', 'ui.error.generic.message', Theme.Error))
        }
    }
}
