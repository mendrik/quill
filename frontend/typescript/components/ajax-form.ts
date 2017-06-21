module quill.components {

    import GestureWidget = feather.ui.events.GestureWidget
    import Theme = feather.ui.toast.Theme
    import setDeepValue = feather.objects.setDeepValue
    import ToastManager = feather.ui.toast.ToastManager
    import Toast = feather.ui.toast.Toast
    import Subscribe = feather.hub.Subscribe
    import On = feather.event.On
    import TypedMap = feather.types.TypedMap
    import Rest = feather.xhr.Rest

    export class AjaxForm extends GestureWidget {

        @Subscribe('xhr-failure-400')
        requestFailed(err: Errors, xhr) {
            const messages = err.errors.map(e => {
                if (e.type === 'validation') {
                    this.triggerDown('field-error', e.field)
                }
                return e.message
            })
            ToastManager.showToast(new Toast("Sign up failed", messages, Theme.Warning))
        }

        @On({event: 'textchange', selector: 'input'})
        textChanged(ev: TextEvent, el: HTMLInputElement) {
            let closest = (ev.target as HTMLElement).closest('[bind]')
            if (closest) {
                setDeepValue(this, closest.getAttribute('bind'), el.value)
            }
        }
    }
}
