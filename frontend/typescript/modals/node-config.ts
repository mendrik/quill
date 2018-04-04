module quill.modal {

    import Template       = feather.annotations.Template
    import TreeNodeIcon   = feather.ui.tree.TreeNodeIcon
    import Subscribe      = feather.hub.Subscribe
    import Tab            = feather.ui.Tab
    import NodeType       = quill.NodeType
    import RadioSetConfig = quill.ui.RadioSetConfig
    import Rest = feather.xhr.Rest
    import Method = feather.xhr.Method

    const parentTabs = {
        string: 'tab.string',
        text: 'tab.string',
        number: 'tab.number',
        fraction: 'tab.number',
        date: 'tab.date',
        datetime: 'tab.date',
        boolean: 'tab.boolean',
        list: 'tab.list',
        enum: 'tab.list',
    }

    export class NodeConfigModal extends ModalWidget {

        node: CustomTreeNode
        nodeConfig: NodeConfig
        private configured: Function

        constructor(node: CustomTreeNode, nodeConfig: NodeConfig, configured: Function) {
            super()
            this.node = node
            this.nodeConfig = nodeConfig
            this.configured = configured
        }

        init(el: Element) {
            this.triggerDown('tab-key-activate', this.nodeConfig.nodeType)
            const parentTab = parentTabs[this.nodeConfig.nodeType]
            if (parentTab !== this.nodeConfig.nodeType) {
                this.triggerDown('tab-key-activate', parentTab)
            }
        }

        @Subscribe('ok-clicked')
        okClicked() {
            this.saveConfig()
        }

        @Rest({url: '/node/{{node.id}}/configure', method: Method.PUT, body: 'nodeConfig', headers: quill.headers})
        saveConfig(conf?: NodeConfig) {
            this.configured(conf)
            this.triggerUp('close-modal')
        }

        getTitle () {
            return 'ui.modal.node-config.title'
        }

        @Subscribe('activate-tab')
        activateTab(tab: Tab) {
            const tabKey = tab.getTabKey()
            if (!/^tab\..*$/.test(tabKey)) { // sub tab clicked
                this.nodeConfig.nodeType = tabKey as NodeType
            } else {
                this.nodeConfig.nodeType =
                    tab.container.querySelector('[tab-key]:not([hidden])').getAttribute('tab-key') as NodeType
            }
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
                 tab-key="tab.list"
                 icon=${TreeNodeIcon.array}>
                 <tabs class="vertical">
                    ${this.infiniteList()}
                    ${this.enumeration()}
                </tabs>
            </div>`
        }

        infiniteList() {
            return `
            <div title="ui.modal.node-config.list.title"
                 icon="database"
                 tab-key="list" active>
                ABC
            </div>`
        }

        enumeration() {
            return `
            <div title="ui.modal.node-config.enumeration.title"
                 tab-key="enum"
                 icon="list-alt">
                ABC
            </div>`
        }

        boolTab() {
            return `
            <div title="ui.modal.node-config.tabs.boolean"
                 tab-key="boolean"
                 icon=${TreeNodeIcon.boolean}></div>`
        }

        dateTab() {
            return `
            <div title="ui.modal.node-config.tabs.date"
                 tab-key="tab.date"
                 icon=${TreeNodeIcon.date}>
                <tabs class="vertical">
                    ${this.date()}
                    ${this.datetime()}
                </tabs>
            </div>`
        }

        date() {
            return `
            <div title="ui.modal.node-config.date.title"
                 tab-key="date"
                 icon="calendar" active>
                ABC
            </div>`
        }

        datetime() {
            return `
            <div title="ui.modal.node-config.datetime.title"
                  tab-key="datetime"
                 icon="clock-o">
                ABC
            </div>`
        }

        numberTab() {
            return `
                <div title="ui.modal.node-config.tabs.number"
                     tab-key="tab.number"
                     icon=${TreeNodeIcon.number}>
                    <tabs class="vertical">
                        ${this.integer()}
                        ${this.fractions()}
                    </tabs>
                </div>`
        }

        integer() {
            return `
            <div title="ui.modal.node-config.integer.title"
                 tab-key="number"
                 icon="thermometer" active>
                ABC
            </div>`
        }

        fractions() {
            return `
            <div title="ui.modal.node-config.fraction.title"
                 tab-key="fraction"
                 icon="pie-chart">
                ABC
            </div>`
        }

        textTab() {
            return `
            <div title="ui.modal.node-config.tabs.text"
                 tab-key="tab.string"
                 icon=${TreeNodeIcon.text} active>
                <tabs class="vertical">
                    ${this.singleLine()}
                    ${this.multiLine()}
                </tabs>
            </div>`
        }

        singleLine() {
            return `
            <div title="ui.modal.node-config.single-line.title"
                 tab-key="string"
                 icon="font" active>
                ABC
            </div>`
        }

        multiLine() {
            return `
            <div title="ui.modal.node-config.multi-line.title"
                 tab-key="text"
                 icon="align-justify">
                <RadioSet config={multilineRadioConfig}
                          selected={nodeConfig.multiline.editor}/>
            </div>`
        }

        multilineRadioConfig: RadioSetConfig<MultilineEditor> = {
            label: 'ui.modal.node-config.multi-line.type',
            name: 'multiline-type',
            radios: [
                {key: 'ui.modal.node-config.multi-line.normal',
                    value: MultilineEditor.normal},
                {key: 'ui.modal.node-config.multi-line.richtext',
                    value: MultilineEditor.richtext},
                {key: 'ui.modal.node-config.multi-line.markdown',
                    value: MultilineEditor.markdown}
            ],
            onChange: (value: MultilineEditor) => {
                this.nodeConfig.multiline.editor = value
            }
        }
    }
}
