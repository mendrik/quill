module quill {

    import Template      = feather.annotations.Template
    import On            = feather.event.On
    import GestureWidget = feather.ui.events.GestureWidget

    export class NotFoundPage extends GestureWidget {

        @On({event: 'tap', selector: '.back-action', preventDefault: true})
        backButtonClicked() {
            this.route('/')
        }

        @Template('default')
        loginPage() {
            return `
            <scroll-pane class="grow">
                <div class="small-info-page">
                  <h1 key="ui.page.notfound.title"/>
                  <p key="ui.page.notfound.body"/>
                  <div class="form-components">
                    <div class="block has-text-right">
                        <a class="button is-primary back-action" key="ui.page.notfound.button"/>
                    </div>
                  </div>
                </div>
            </scroll-pane>
            `
        }
    }
}
