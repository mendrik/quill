module quill.modal {

    import Template  = feather.annotations.Template

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
            return `<div class="">NodeConfig</div>`
        }
    }
}
