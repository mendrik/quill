module quill {

    import Template      = feather.annotations.Template
    import Translate     = quill.components.Translate
    import On            = feather.event.On
    import GestureWidget = feather.ui.events.GestureWidget

    export class NotFoundPage extends GestureWidget {

        @On({event: 'tap', selector: '.back-action', preventDefault: true})
        backButtonClicked() {
            this.route('/')
        }

        @Template('default', false)
        loginPage() {
            return Translate.translate(`
            <scroll-pane class="grow">
                <div class="small-info-page">
                  <h1>•ui.page.notfound.title</h1>
                  <p>•ui.page.notfound.body</p>
                  <div class="form-components">
                    <div class="block has-text-right">
                        <a class="button is-primary back-action">•ui.page.notfound.button</a>
                    </div>
                  </div>
                </div>
            </scroll-pane>
            `)
        }
    }
}
