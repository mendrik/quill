module quill.modal {

    import Template      = feather.annotations.Template
    import Construct     = feather.annotations.Construct
    import GestureWidget = feather.ui.events.GestureWidget
    import Subscribe     = feather.hub.Subscribe
    import Widget        = feather.core.Widget
    import Bind          = feather.observe.Bind
    import On            = feather.event.On

    export abstract class ModalWidget extends Widget {
        abstract getTitle()
        successButton = () => 'ui.modal.ok'
        cancelButton = () => 'ui.modal.cancel'

        @On({event: 'keydown'})
        escKey(ev: KeyboardEvent) {
            if (/escape/i.test(ev.key)) {
                this.triggerUp('close-modal')
            }
        }
    }

    @Construct({selector: 'modal-manager', singleton: true})
    export class ModalManager extends GestureWidget {

        @Bind() modal: Widget[] = []
        @Bind() showing = false
        @Bind() title = 'ui.modal.title'
        @Bind() successButton = 'ui.modal.ok'
        @Bind() cancelButton = 'ui.modal.cancel'

        lastFocussedElement: HTMLElement

        init() {
            this.render()
        }

        @Subscribe('close-modal')
        closeCall() {
            this.close()
        }

        @Subscribe('show-modal')
        show(modal: ModalWidget) {
            this.lastFocussedElement = document.activeElement as HTMLElement
            this.modal.splice(0, this.modal.length, modal)
            this.title = modal.getTitle()
            this.successButton = modal.successButton()
            this.cancelButton = modal.cancelButton()
            this.showing = true
            modal.element.setAttribute('tabindex', '-1');
            (modal.element as HTMLElement).focus()
        }

        @Subscribe('close-modal')
        @On({event: 'mousedown', selector: '.modal-background'})
        close() {
            this.showing = false
            if (this.lastFocussedElement) {
                this.lastFocussedElement.focus()
            }
        }

        @On({event: 'click', selector: 'button.cancel,button.delete'})
        closeButtons() {
            this.close()
        }

        @On({event: 'click', selector: 'button.ok'})
        okClicked() {
            this.triggerDown('ok-clicked')
        }

        @Template()
        markup() {
            return `<div class="modal {{showing:toActive}}">
              <div class="modal-background"/>
              <div class="modal-card is-small">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{title:translate}}</p>
                  <button class="delete" aria-label="close"/>
                </header>
                <section class="modal-card-body is-small" {{modal}}/>
                <footer class="modal-card-foot">
                  <button class="button is-inverted ok">{{successButton:translate}}</button>
                  <button class="button is-inverted cancel">{{cancelButton:translate}}</button>
                </footer>
              </div>
            </div>`
        }

        toActive = (showing: boolean) => showing ? 'is-active' : undefined
    }
}
