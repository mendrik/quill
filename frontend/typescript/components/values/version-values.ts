module quill {

    import Widget    = feather.core.Widget
    import Template  = feather.annotations.Template
    import Rest      = feather.xhr.Rest
    import Bind      = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe

    export class VersionValues extends Widget {

        @Bind() version: Version
        @Bind() nodes: ValueNode[] = []

        constructor(version: Version) {
            super()
            this.version = version
        }

        @Subscribe('visible-nodes')
        async nodesInitialized(nodes: CustomTreeNode[]) {
            const version: Version = await this.loadVersionValue() as any
            const values = nodes.map(node => {
                const value = version.values.find(v => v.nodeId === node.value.id)
                return this.valueNodeFactory(node, value)
            })
            this.nodes.splice(0, this.nodes.length, ...values)
        }

        @Rest({url: '/values/version/{{version.id}}', headers: quill.headers})
        async loadVersionValue() {}

        @Subscribe('update-node-values')
        updateNodeValues() {
            this.nodes.splice(0, 0)
        }

        @Template()
        markup() {
            return `
             <li class="v-flex">
                <div class="level version-header no-grow">
                    <div class="level-left">
                        <span class="level-item">
                            <span class="icon is-small"><Icon name="book"/></span>
                            <span class="version-name">{{version.name}}</span>
                        </span>
                    </div>
                    <div class="level-right">
                        <a class="button is-small tooltip"
                           action="version-github"
                           tooltip="ui.tooltip.version.github">
                            <Icon name="github" icon-class="is-small"/>
                        </a>
                        <a class="button is-small tooltip"
                           action="version-download"
                           tooltip="ui.tooltip.version.json-download">
                            <Icon name="download" icon-class="is-small"/>
                        </a>
                        <a class="button is-small tooltip"
                           action="version-configure"
                           tooltip="ui.tooltip.version.configure">
                            <Icon name="cog" icon-class="is-small"/>
                        </a>
                    </div>
                </div>
                <scroll-receiver class="grow" {{nodes:byNodeVisibility}}/>
            </li>`
        }

        byNodeVisibility = () => (n: ValueNode) => !n.node.parent || n.node.allParentsOpen()

        valueNodeFactory(node: CustomTreeNode, value?: Value) {
            if (node.hasChildren()) {
                return new EmptyValueNode(node, value)
            } else {
                return new DefaultValueNode(node, value)
            }
        }
    }
}
