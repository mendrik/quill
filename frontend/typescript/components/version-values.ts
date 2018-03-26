module quill {

    import Widget    = feather.core.Widget
    import Template  = feather.annotations.Template
    import Rest      = feather.xhr.Rest
    import Bind      = feather.observe.Bind

    export class VersionValues extends Widget {

        @Bind() version: Version
        nodes: ValueNode[]

        constructor(version: Version) {
            super()
            this.version = version
        }

        init(el: Element) {
            this.loadVersionValues()
        }

        @Rest({url: '/values/version/{{version.id}}', headers: quill.headers})
        loadVersionValues() {
            // ignore
        }

        @Template()
        markup() {
            return `
             <li>
                <a>
                    <span class="icon is-small"><i class="fas fa-file-alt"></i></span>
                    <span>{{version.name}}</span>
                </a>
            </li>`
        }
    }
}
