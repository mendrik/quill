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
                  <h1><translate key="ui.page.notfound.title"/></h1>
                  <p><translate key="ui.page.notfound.body"/></p>
                  <div class="form-components">
                    <div class="block has-text-right">
                        <a class="button is-primary back-action"><translate key="ui.page.notfound.button"/></a>
                    </div>
                  </div>
                </div>
            </scroll-pane>
            `
        }
    }
}
