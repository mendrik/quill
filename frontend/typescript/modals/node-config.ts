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
                ${NodeConfigModal.textTab()}
                ${NodeConfigModal.numberTab()}
                ${NodeConfigModal.dateTab()}
                ${NodeConfigModal.boolTab()}
                ${NodeConfigModal.listTab()}
                ${NodeConfigModal.fileTab()}
            </tabs>`
        }

        static fileTab() {
            return `
            <div title="ui.modal.node-config.tabs.file"
                 icon=${TreeNodeIcon.file}></div>`
        }

        static listTab() {
            return `
            <div title="ui.modal.node-config.tabs.list"
                 icon=${TreeNodeIcon.array}>
                 <tabs class="vertical">
                    ${NodeConfigModal.infiniteList()}
                    ${NodeConfigModal.enumeration()}
                </tabs>
            </div>`
        }

        static infiniteList() {
            return `
            <div title="ui.modal.node-config.list.title" icon="database" active>
                ABC
            </div>`
        }

        static enumeration() {
            return `
            <div title="ui.modal.node-config.enumeration.title" icon="list-alt">
                ABC
            </div>`
        }

        static boolTab() {
            return `
            <div title="ui.modal.node-config.tabs.boolean"
                 icon=${TreeNodeIcon.boolean}></div>`
        }

        static dateTab() {
            return `
                <div title="ui.modal.node-config.tabs.date"
                     icon=${TreeNodeIcon.date}>
                    <tabs class="vertical">
                        ${NodeConfigModal.date()}
                        ${NodeConfigModal.datetime()}
                    </tabs>
                </div>`
        }

        static date() {
            return `
            <div title="ui.modal.node-config.date.title" icon="calendar" active>
                ABC
            </div>`
        }

        static datetime() {
            return `
            <div title="ui.modal.node-config.datetime.title" icon="clock-o">
                ABC
            </div>`
        }

        static numberTab() {
            return `
                <div title="ui.modal.node-config.tabs.number"
                     icon=${TreeNodeIcon.number}>
                    <tabs class="vertical">
                        ${NodeConfigModal.integer()}
                        ${NodeConfigModal.fractions()}
                    </tabs>
                </div>`
        }

        static integer() {
            return `
            <div title="ui.modal.node-config.number.integer.title" icon="thermometer" active>
                ABC
            </div>`
        }

        static fractions() {
            return `
            <div title="ui.modal.node-config.number.fraction.title" icon="pie-chart">
                ABC
            </div>`
        }

        static textTab() {
            return `
                <div title="ui.modal.node-config.tabs.text"
                     icon=${TreeNodeIcon.text} active>
                    <tabs class="vertical">
                        ${NodeConfigModal.singleLine()}
                        ${NodeConfigModal.multiLine()}
                    </tabs>
                </div>`
        }

        static singleLine() {
            return `
            <div title="ui.modal.node-config.text.single-line.title" icon="font" active>
                ABC
            </div>`
        }

        static multiLine() {
            return `
            <div title="ui.modal.node-config.text.multi-line.title"
                 icon="align-justify">
                <RadioSet config={this.multilineRadioConfig}/>
            </div>`
        }

        multilineRadioConfig: RadioSetConfig<MultilineType> = {
            label: 'ui.modal.node-config.text.multi-line.type',
            name: 'multiline-type',
            selected: MultilineType.normal,
            radios: [
                {key: 'ui.modal.node-config.text.multi-line.normal',
                    value: MultilineType.normal},
                {key: 'ui.modal.node-config.text.multi-line.richtext',
                    value: MultilineType.richtext},
                {key: 'ui.modal.node-config.text.multi-line.markdown',
                    value: MultilineType.markdown}
            ],
            onChange: (value: MultilineType) =>
                this.nodeConfig.multiLine.type = value
        }
    }
}
