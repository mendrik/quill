module quill.modal {

    import Template     = feather.annotations.Template
    import TreeNodeIcon = feather.ui.tree.TreeNodeIcon
    import Subscribe    = feather.hub.Subscribe
    import Tab          = feather.ui.Tab
    import Tabs         = feather.ui.Tabs
    import NodeType = quill.NodeType

    export class NodeConfigModal extends ModalWidget {

        node: CustomTreeNode
        nodeConfig: NodeConfig

        constructor(node: CustomTreeNode, nodeConfig: NodeConfig) {
            super()
            this.node = node
            this.nodeConfig = nodeConfig
        }

        init(el: Element) {
            switch (this.nodeConfig.nodeType) { // open correct tab
                case 'string': this.goToTab('tabs.text', 'single-line.title'); break
                case 'text': this.goToTab('tabs.text', 'multi-line.title'); break
                case 'number': this.goToTab('tabs.number', 'integer.title'); break
                case 'fraction': this.goToTab('tabs.number', 'fraction.title'); break
                case 'boolean': this.goToTab('tabs.boolean'); break
                case 'date': this.goToTab('tabs.date', 'date.title'); break
                case 'datetime': this.goToTab('tabs.date', 'datetime.title'); break
                case 'list': this.goToTab('tabs.list', 'list.title'); break
                case 'enum': this.goToTab('tabs.list', 'enum.title'); break
            }
        }

        goToTab(...tabs: string[]) {
            tabs.forEach(text => this.triggerDown('tab-text-activate', 'ui.modal.node-config.' + text))
        }

        @Subscribe('ok-clicked')
        okClicked() {
            // todo save config
            this.triggerUp('close-modal')
        }

        getTitle () {
            return 'ui.modal.node-config.title'
        }

        @Subscribe('activate-tab')
        onTabClicked(tab: Tab) {
            const text = tab.text.substr('ui.modal.node-config.'.length)
            if (text.startsWith('tabs.')) { // activate first tab
                this.childWidgets.filter(t => t instanceof Tabs && t.childWidgets.length === 2).forEach(tab => {
                    tab.triggerDown('activate-tab', tab.childWidgets[0])
                })
            }
            switch (text) {
                case 'tabs.text': this.nodeConfig.nodeType = 'string'; break
                case 'single-line.title': this.nodeConfig.nodeType = 'string'; break
                case 'multi-line.title': this.nodeConfig.nodeType = 'text'; break
                case 'tabs.number': this.nodeConfig.nodeType = 'number'; break
                case 'integer.title': this.nodeConfig.nodeType = 'number'; break
                case 'fraction.title': this.nodeConfig.nodeType = 'fraction'; break
                case 'tabs.date': this.nodeConfig.nodeType = 'date'; break
                case 'date.title': this.nodeConfig.nodeType = 'date'; break
                case 'datetime.title': this.nodeConfig.nodeType = 'datetime'; break
                case 'tabs.boolean': this.nodeConfig.nodeType = 'boolean'; break
                case 'tabs.list': this.nodeConfig.nodeType = 'list'; break
                case 'list.title': this.nodeConfig.nodeType = 'list'; break
                case 'enumeration.title': this.nodeConfig.nodeType = 'enum'; break
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
            <div title="ui.modal.node-config.integer.title" icon="thermometer" active>
                ABC
            </div>`
        }

        fractions() {
            return `
            <div title="ui.modal.node-config.fraction.title" icon="pie-chart">
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
            <div title="ui.modal.node-config.single-line.title" icon="font" active>
                ABC
            </div>`
        }

        multiLine() {
            return `
            <div title="ui.modal.node-config.multi-line.title"
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
            onChange: (value: MultilineEditor) =>
                this.nodeConfig.multiline.editor = value
        }
    }
}
