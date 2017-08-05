module quill.components {

    import Widget    = feather.core.Widget;
    import Construct = feather.annotations.Construct;
    import Template  = feather.annotations.Template;
    import TypedMap  = feather.types.TypedMap;
    import Bind      = feather.observe.Bind;

    @Construct({selector: 'translate', attributes: ['key']})
    export class Translate extends Widget {

        static translations: TypedMap<string>

        @Bind({html: true}) key: string

        constructor(key: string) {
            super()
            this.key = key;
        }

        init() {
            this.render()
        }

        @Template()
        text() {
            return '<span>{{key:translated}}</span>'
        }

        translated = (key: string) => Translate.translations[key]

        static translate = (text: string) => text.replace(/•([A-Z\.\-_]+)/gi, (m, g) => {
            const translations = Translate.translations || {}
            return translations[g] || g
        })
    }
}
