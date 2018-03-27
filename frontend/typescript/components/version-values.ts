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
                <div class="level version-header">
                    <div class="level-left">
                        <span class="level-item">
                            <span class="icon is-small"><Icon name="book"/></span>
                            <span class="version-name">{{version.name}}</span>
                        </span>
                    </div>
                    <div class="level-right">
                        <a class="button is-small" action="node-configure"><Icon name="cog" icon-class="is-small"/></a>
                    </div>
                </div>
                <div class="synched-value-scroll">
                </div>
            </li>`
        }
    }
}
