module quill.components {

    import Widget    = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template  = feather.annotations.Template
    import Bind      = feather.observe.Bind

    @Construct({selector: 'html-fragment', attributes: ['html-key']})
    export class HtmlFragment extends Widget {

        @Bind({html: true}) key: string

        constructor(key: string) {
            super()
            this.key = key
        }

        init(element: HTMLElement) {
            element.classList.remove('html-key')
            this.render()
        }

        @Template()
        text() {
            return '{{key:translate}}'
        }

    }
}
