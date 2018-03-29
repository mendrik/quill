module quill.modal {

    import Template = feather.annotations.Template

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
            <div class="tabs is-boxed">
                <ul>
                    <li class="is-active"><a>Text</a></li>
                    <li class=""><a>Number</a></li>
                    <li class=""><a>Date</a></li>
                    <li class=""><a>On/Off</a></li>
                    <li class=""><a>List</a></li>
                </ul>
            </div>`
        }
    }
}
