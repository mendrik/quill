module quill.modal {

    import Template      = feather.annotations.Template
    import Construct     = feather.annotations.Construct
    import GestureWidget = feather.ui.events.GestureWidget
    import Subscribe     = feather.hub.Subscribe
    import Widget        = feather.core.Widget
    import Bind          = feather.observe.Bind

    export abstract class ModalWidget extends Widget {
        abstract getTitle()
        successButton = () => 'ui.modal.ok'
        cancelButton = () => 'ui.modal.cancel'
    }

    @Construct({selector: 'modal-manager', singleton: true})
    export class ModalManager extends GestureWidget {

        @Bind() modal: Widget[] = []
        @Bind() showing = false
        @Bind() title = 'ui.modal.title'
        @Bind() successButton = 'ui.modal.ok'
        @Bind() cancelButton = 'ui.modal.cancel'

        init() {
            this.render()
        }

        @Subscribe('show-modal')
        show(modal: ModalWidget) {
            this.modal.splice(0, this.modal.length, modal)
            this.title = modal.getTitle()
            this.successButton = modal.successButton()
            this.cancelButton = modal.cancelButton()
            this.showing = true
        }

        @Template()
        markup() {
            return `<div class="modal {{showing:toActive}}">
              <div class="modal-background"/>
              <div class="modal-card">
                <header class="modal-card-head">
                  <p class="modal-card-title">{{title:translate}}</p>
                  <button class="delete" aria-label="close"/>
                </header>
                <section class="modal-card-body" {{modal}}/>
                <footer class="modal-card-foot">
                  <button class="button is-success">{{successButton:translate}}</button>
                  <button class="button">{{cancelButton:translate}}</button>
                </footer>
              </div>
            </div>`
        }

        toActive = (showing: boolean) => showing ? 'is-active' : undefined
    }
}
