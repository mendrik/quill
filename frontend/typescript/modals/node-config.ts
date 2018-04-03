module quill.modal {

    import Template = feather.annotations.Template
    import TreeNodeIcon = feather.ui.tree.TreeNodeIcon

    export class NodeConfigModal extends ModalWidget {

        node: CustomTreeNode
        nodeConfig: NodeConfig

        constructor(node: CustomTreeNode, nodeConfig: NodeConfig) {
            super()
            this.node = node
            this.nodeConfig = nodeConfig
        }

        getTitle () {
            return 'ui.modal.node-config.title'
        }

        @Template()
        markup() {
            return `
            <tabs tabs-class="is-boxed">
                ${this.textTab()}
                ${this.numberTab()}
                ${this.dateTab()}
                ${this.boolTab()}
                ${this.listTab()}
            </tabs>`
        }

        listTab() {
            return `
            <div title="ui.modal.node-config.tabs.list"
                 icon=${TreeNodeIcon.array}>
                 <tabs class="vertical">
                    ${this.infiniteList()}
                    ${this.enumeration()}
                </tabs>
            </div>`
        }

        infiniteList() {
            return `
            <div title="ui.modal.node-config.list.title" icon="database" active>
                ABC
            </div>`
        }

        enumeration() {
            return `
            <div title="ui.modal.node-config.enumeration.title" icon="list-alt">
                ABC
            </div>`
        }

        boolTab() {
            return `
            <div title="ui.modal.node-config.tabs.boolean"
                 icon=${TreeNodeIcon.boolean}></div>`
        }

        dateTab() {
            return `
                <div title="ui.modal.node-config.tabs.date"
                     icon=${TreeNodeIcon.date}>
                    <tabs class="vertical">
                        ${this.date()}
                        ${this.datetime()}
                    </tabs>
                </div>`
        }

        date() {
            return `
            <div title="ui.modal.node-config.date.title" icon="calendar" active>
                ABC
            </div>`
        }

        datetime() {
            return `
            <div title="ui.modal.node-config.datetime.title" icon="clock-o">
                ABC
            </div>`
        }

        numberTab() {
            return `
                <div title="ui.modal.node-config.tabs.number"
                     icon=${TreeNodeIcon.number}>
                    <tabs class="vertical">
                        ${this.integer()}
                        ${this.fractions()}
                    </tabs>
                </div>`
        }

        integer() {
            return `
            <div title="ui.modal.node-config.number.integer.title" icon="thermometer" active>
                ABC
            </div>`
        }

        fractions() {
            return `
            <div title="ui.modal.node-config.number.fraction.title" icon="pie-chart">
                ABC
            </div>`
        }

        textTab() {
            return `
                <div title="ui.modal.node-config.tabs.text"
                     icon=${TreeNodeIcon.text} active>
                    <tabs class="vertical">
                        ${this.singleLine()}
                        ${this.multiLine()}
                    </tabs>
                </div>`
        }

        singleLine() {
            return `
            <div title="ui.modal.node-config.text.single-line.title" icon="font" active>
                ABC
            </div>`
        }

        multiLine() {
            return `
            <div title="ui.modal.node-config.text.multi-line.title"
                 icon="align-justify">
                <RadioSet config={multilineRadioConfig}
                          selected={nodeConfig.multiline.editor}/>
            </div>`
        }

        multilineRadioConfig: RadioSetConfig<MultilineEditor> = {
            label: 'ui.modal.node-config.text.multi-line.type',
            name: 'multiline-type',
            radios: [
                {key: 'ui.modal.node-config.text.multi-line.normal',
                    value: MultilineEditor.normal},
                {key: 'ui.modal.node-config.text.multi-line.richtext',
                    value: MultilineEditor.richtext},
                {key: 'ui.modal.node-config.text.multi-line.markdown',
                    value: MultilineEditor.markdown}
            ],
            onChange: (value: MultilineEditor) =>
                this.nodeConfig.multiline.editor = value
        }
    }
}
