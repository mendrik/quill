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
                ${NodeConfig.textTab()}
                ${NodeConfig.numberTab()}
                ${NodeConfig.dateTab()}
                ${NodeConfig.boolTab()}
                ${NodeConfig.listTab()}
                ${NodeConfig.fileTab()}
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
                 icon=${TreeNodeIcon.array}></div>`
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
                        ${NodeConfig.date()}
                        ${NodeConfig.datetime()}
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
                        ${NodeConfig.integer()}
                        ${NodeConfig.fractions()}
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
                        ${NodeConfig.singleLine()}
                        ${NodeConfig.multiLine()}
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
            <div title="ui.modal.node-config.text.multi-line.title" icon="align-justify">
                <div class="field">
                    <input class="is-checkradio has-no-border" id="multiline-normal" type="radio" name="mutiline-format" checked="checked">
                    <label for="multiline-normal" key="ui.modal.node-config.text.multi-line.normal"/>
                </div>
                <div class="field">
                    <input class="is-checkradio has-no-border" id="multiline-rtf" type="radio" name="mutiline-format">
                    <label for="multiline-rtf" key="ui.modal.node-config.text.multi-line.richtext"/>
                </div>
                <div class="field">
                    <input class="is-checkradio has-no-border" id="multiline-md" type="radio" name="mutiline-format">
                    <label for="multiline-md" key="ui.modal.node-config.text.multi-line.markdown"/>
                </div>
            </div>`
        }
    }
}
