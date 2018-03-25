module quill {

    import Widget    = feather.core.Widget;
    import Template  = feather.annotations.Template;
    import Rest = feather.xhr.Rest;

    export class VersionValues extends Widget {

        version: string
        nodes: ValueNode[]

        constructor(version: string) {
            super()
            this.version = version
        }

        init(el: Element) {
            this.loadVersionValues()
        }

        @Rest({url: '/version/{{version}}/values', headers: quill.headers})
        loadVersionValues() {
            // ignore
        }

        @Template()
        markup() {
            return `
             <li>
                <a>
                    <span class="icon is-small"><i class="fas fa-file-alt"></i></span>
                    <span>Documents</span>
                </a>
            </li>`
        }
    }
}
