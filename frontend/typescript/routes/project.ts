module quill {

    import Template        = feather.annotations.Template
    import Bind            = feather.observe.Bind
    import Subscribe       = feather.hub.Subscribe
    import Rest            = feather.xhr.Rest
    import Method          = feather.xhr.Method
    import isDef           = feather.functions.isDef
    import removeFromArray = feather.arrays.removeFromArray
    import AjaxWidget      = quill.components.AjaxWidget

    interface RenameNode {
        name: string
    }

    const dummyProject: Project = {
        id: 0,
        name: '',
        structure: [],
        schema: []
    }

    export class ProjectPage extends AjaxWidget {

        @Bind() nodes: Array<CustomTreeNode> = []
        @Bind() schemaNodes: Array<CustomTreeNode> = []
        @Bind({bequeath: true}) project: Project = dummyProject

        projectId: string
        currentTreeNode: CustomTreeNode
        currentRootType: NodeRoot = 'structure'

        newNode: NewNode = {
            name: 'New node',
            sort: 0
        }

        renameNode: RenameNode
        moveNode: NodeDrop

        id = () => this.projectId

        constructor(projectId: string) {
            super()
            this.projectId = projectId
        }

        init() {
            Progress.start()
            this.fetchProject()
        }

        @Rest({url: '/projects/{{projectId}}', headers: quill.headers})
        fetchProject(project?: Project) {
            this.project = project
            this.nodes.splice(0, this.nodes.length,
                ...project.structure.map(CustomTreeNode.toTreeNode))
            Progress.stop()
        }

        @Subscribe('node-defocused')
        nodeDeselected(node: CustomTreeNode) {
            this.currentTreeNode = undefined
        }

        @Subscribe('node-focused')
        nodeSelected(node: CustomTreeNode) {
            (node.element as HTMLLIElement).focus()
            this.currentTreeNode = node
            this.triggerDown('defocus-other-nodes', node)
        }

        @Subscribe('root-type-selected')
        rootTypeSelected(type: NodeRoot) {
            this.currentRootType = type
            this.currentTreeNode = undefined
            this.triggerDown('defocus-other-nodes')
        }

        @Subscribe('node-action')
        nodeAction(action: string) {
            switch (action) {
                case 'node-add': {
                    Progress.start()
                    if (isDef(this.currentTreeNode)) {
                        this.createChildNode()
                    } else {
                        this.createNode()
                    }
                    break
                }
                case 'node-delete': {
                    this.deleteNode()
                    break
                }
            }
        }

        @Rest({url: '/node/{{currentTreeNode.id}}', method: Method.POST, body: 'newNode', headers: quill.headers})
        createChildNode(node?: Node) {
            Progress.stop()
            const newNode = CustomTreeNode.toTreeNode(node)
            this.currentTreeNode.add(newNode)
            this.currentTreeNode.open = true
            this.currentTreeNode.selected = false
            newNode.focusAndEdit()
        }

        @Rest({url: '/projects/{{projectId}}/{{currentRootType}}', method: Method.POST, body: 'newNode', headers: quill.headers})
        createNode(node?: Node) {
            Progress.stop()
            const newNode = CustomTreeNode.toTreeNode(node)
            this.nodes.push(newNode)
            newNode.focusAndEdit()
        }

        @Rest({url: '/node/{{currentTreeNode.id}}', method: Method.DELETE, headers: quill.headers})
        deleteNode() {
            const node = this.currentTreeNode
            const nodes = isDef(node.parent) ? node.parent.children : this.nodes
            removeFromArray(nodes, [node])
            this.currentTreeNode = undefined
            this.triggerDown('defocus-other-nodes')
        }

        @Rest({url: '/node/{{currentTreeNode.id}}', method: Method.PUT, body: 'renameNode', headers: quill.headers})
        renameNodeCall() {
            Progress.stop()
        }

        @Subscribe('node-edited')
        editNode(node: CustomTreeNode) {
            Progress.start()
            this.renameNode = {name: node.text}
            this.renameNodeCall()
        }

        @Rest({url: '/node/{{moveNode.from}}/to/{{moveNode.to}}', method: Method.PUT, body: 'moveNode', headers: quill.headers})
        moveNodeCall() {
            Progress.stop()
        }

        @Subscribe('node-drop')
        dragNode(drop: NodeDrop) {
            Progress.start()
            this.moveNode = {...drop}
            this.moveNodeCall()
        }

        @Template()
        projectPage() {
            return `
            <panel class="fullscreen v-flex">
                <navigation class="no-grow"></navigation>
                <horizontal-split class="grow" id="app-split">
                  <sidebar class="v-flex">
                    <tree-actions></tree-actions>
                    <scroll-pane class="grow">
                      <aside class="menu">
                        <selectable-tree-label label="Structure" selected={true} type="structure"></selectable-tree-label>
                        <ul class="tree-view is-marginless" {{nodes}}></ul>
                        <selectable-tree-label label="Schemas" selected={false} type="schema"></selectable-tree-label>
                        <ul class="tree-view is-marginless" {{schemaNodes}}></ul>
                      </aside>
                    </scroll-pane>
                  </sidebar>
                  <section class="v-flex">
                    <scroll-pane class="grow">
                    </scroll-pane>
                  </section>
                </horizontal-split>
                <footer class="no-grow"/>
            </panel>`
        }
    }
}
