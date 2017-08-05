module quill.components {

    import GestureWidget = feather.ui.events.GestureWidget
    import Theme = feather.ui.toast.Theme
    import setDeepValue = feather.objects.setDeepValue
    import ToastManager = feather.ui.toast.ToastManager
    import Toast = feather.ui.toast.Toast
    import Subscribe = feather.hub.Subscribe
    import On = feather.event.On

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
                ToastManager.showToast(new Toast(Translate.translations[`ui.${errorType}.failed`], messages, Theme.Warning))
            }
        }

        @Subscribe('xhr-failure-500')
        requestFailed(err: Errors, xhr) {
            Progress.stop()
            ToastManager.showToast(new Toast(Translate.translations['ui.error.server'], err.errors[0].message, Theme.Error))
        }

        @Subscribe('xhr-failure-timeout')
        timeout(err: Errors, xhr) {
            Progress.stop()
            ToastManager.showToast(new Toast(Translate.translations['ui.error.timeout'], Translate.translations['ui.error.timeout.message'], Theme.Error))
        }

        @On({event: 'textchange', selector: 'input'})
        textChanged(ev: TextEvent, el: HTMLInputElement) {
            const closest = (ev.target as HTMLElement).closest('[bind]')
            if (closest) {
                setDeepValue(this, closest.getAttribute('bind'), el.value)
            }
        }

        translated = (key: string) => Translate.translations[key]
    }
}
