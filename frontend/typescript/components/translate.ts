module quill {

    import Widget    = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Bind      = feather.observe.Bind
    import Template  = feather.annotations.Template

    @Construct({selector: '[key]', attributes: ['key']})
    export class Translate extends Widget {

        @Bind() key: string

        constructor(key: string) {
            super()
            this.key = key
        }

        init() {
            this.render()
        }

        @Template()
        markup() {
            return `{{key:translate}}`
        }
    }
}
