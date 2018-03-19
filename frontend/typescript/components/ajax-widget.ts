module quill.components {

    import GestureWidget = feather.ui.events.GestureWidget
    import Theme = feather.ui.toast.Theme
    import ToastManager = feather.ui.toast.ToastManager
    import Toast = feather.ui.toast.Toast
    import Subscribe = feather.hub.Subscribe

    export class AjaxWidget extends GestureWidget {

        @Subscribe('xhr-failure-500')
        requestFailed(err: Errors) {
            Progress.stop()
            ToastManager.showToast(new Toast('ui.error.server', err.errors[0].message, Theme.Error))
        }

        @Subscribe('xhr-failure-403')
        requestForbidden() {
            console.log('failure');
            Progress.stop()
            ToastManager.showToast(new Toast('ui.errors.unauthorized.title', 'ui.errors.unauthorized.message', Theme.Error))
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
