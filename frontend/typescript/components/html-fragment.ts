module quill.components {

    import Widget    = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template  = feather.annotations.Template
    import TypedMap  = feather.types.TypedMap
    import Bind      = feather.observe.Bind

    @Construct({selector: 'html-fragement', attributes: ['key']})
    export class HtmlFragment extends Widget {

        static translations: TypedMap<string>

        @Bind({html: true}) key: string

        constructor(key: string) {
            super()
            this.key = key
        }

        init() {
            this.render()
        }

        @Template()
        text() {
            return '<span>{{key:translate}}</span>'
        }

    }
}
