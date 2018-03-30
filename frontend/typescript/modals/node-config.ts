module quill.modal {

    import Template = feather.annotations.Template
    import TreeNodeIcon = feather.ui.tree.TreeNodeIcon

    export class NodeConfig extends ModalWidget {

        node: CustomTreeNode

        constructor(node: CustomTreeNode) {
            super()
            this.node = node
        }

        getTitle () {
            return 'ui.modal.node-config.title'
        }

        @Template()
        markup() {
            return `
            <tabs tabs-class="is-boxed">
                <div title="ui.modal.node-config.tabs.text"
                     icon=${TreeNodeIcon.text} active>
                    <tabs class="vertical">
                        <div title="ui.modal.node-config.text.single-line" icon="font" active>
                            ABC
                        </div>
                        <div title="ui.modal.node-config.text.multi-line" icon="align-justify">
                            EFG
                        </div>
                    </tabs>
                </div>
                <div title="ui.modal.node-config.tabs.number"
                     icon=${TreeNodeIcon.number}></div>
                <div title="ui.modal.node-config.tabs.date"
                     icon=${TreeNodeIcon.date}></div>
                <div title="ui.modal.node-config.tabs.boolean"
                     icon=${TreeNodeIcon.boolean}></div>
                <div title="ui.modal.node-config.tabs.list"
                     icon=${TreeNodeIcon.array}></div>
                <div title="ui.modal.node-config.tabs.file"
                     icon=${TreeNodeIcon.file}></div>
            </tabs>`
        }
    }
}
