module quill {

    import Construct     = feather.annotations.Construct
    import Template      = feather.annotations.Template
    import GestureWidget = feather.ui.events.GestureWidget

    @Construct({selector: 'content'})
    export class Content extends GestureWidget {

        init() {
            this.render()
        }

        @Template()
        markup() {
            return ``
        }
    }
}
