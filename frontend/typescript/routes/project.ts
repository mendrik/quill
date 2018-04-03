module quill {

    import Template        = feather.annotations.Template
    import Bind            = feather.observe.Bind
    import Subscribe       = feather.hub.Subscribe
    import Rest            = feather.xhr.Rest
    import Method          = feather.xhr.Method
    import On              = feather.event.On
    import matches         = feather.dom.selectorMatches
    import isDef           = feather.functions.isDef
    import removeFromArray = feather.arrays.removeFromArray
    import AjaxWidget      = quill.components.AjaxWidget
    import NodeConfigModal = quill.modal.NodeConfigModal
    import ProjectConfig   = quill.modal.ProjectConfig

    interface RenameNode {
        name: string
    }

    const dummyProject: Project = {
        id: 0,
        name: '',
        structure: [],
        schema: [],
        versions: []
    }

    export class ProjectPage extends AjaxWidget {

        @Bind() nodes: Array<CustomTreeNode> = []
        @Bind() schemaNodes: Array<CustomTreeNode> = []
        @Bind({bequeath: true}) project: Project = dummyProject
        @Bind() loading = true

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
            this.fetchProject()
        }

        @Rest({url: '/projects/{{projectId}}', headers: quill.headers})
        fetchProject(project?: Project) {
            this.project = project
            this.nodes.splice(0, this.nodes.length,
                ...project.structure.map(CustomTreeNode.toTreeNode))
            this.triggerDown('project-loaded', project)
            this.loading = false
        }

        @Subscribe('open-project-settings')
        openProjectSettings() {
            this.triggerSingleton('show-modal', new ProjectConfig(this.project))
        }

        @Subscribe('node-defocused')
        nodeDeselected() {
            this.currentTreeNode = undefined
            this.triggerDown('defocus-other-nodes')
        }

        @Subscribe('node-focused')
        nodeSelected(node: CustomTreeNode) {
            (node.element as HTMLLIElement).focus()
            this.currentTreeNode = node
            this.currentTreeNode.selected = true
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
                    this.addNode()
                    break
                }
                case 'node-edit': {
                    this.currentTreeNode.focusAndEdit()
                    break
                }
                case 'node-configure': {
                    this.configureNode()
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

        @Rest({url: '/node/{{currentTreeNode.id}}/rename', method: Method.PUT, body: 'renameNode', headers: quill.headers})
        renameNodeCall() {
            Progress.stop()
        }

        @Subscribe('node-edited')
        editNode(node: CustomTreeNode) {
            Progress.start()
            this.renameNode = {name: node.text}
            this.renameNodeCall()
        }

        @Rest({url: '/node/{{moveNode.from}}/move', method: Method.PUT, body: 'moveNode', headers: quill.headers})
        moveNodeCall() {
            Progress.stop()
            const mn       = this.moveNode
            const allNodes = this.allNodes(this.nodes)
            const from     = allNodes.find(n => n.id() === mn.from)
            const to       = allNodes.find(n => n.id() === mn.to)
            const nodes    = isDef(from.parent) ? from.parent.children : this.nodes
            const toNodes  = isDef(to.parent) ? to.parent.children : this.nodes
            removeFromArray(nodes, [from])
            if (mn.position === DropPostion.inside) {
                const position = nodes.indexOf(to)
                to.add(from, position + 1)
            } else {
                const index = toNodes.indexOf(to) + (mn.position === DropPostion.below ? 1 : 0)
                toNodes.splice(index, 0, from)
            }
        }

        @Subscribe('node-drop')
        dragNode(drop: NodeDrop) {
            Progress.start()
            this.moveNode = {...drop}
            this.moveNodeCall()
        }

        @Rest({url: '/node/{{currentTreeNode.id}}/configure', method: Method.GET, headers: quill.headers})
        private configureNode(config?: NodeConfig) {
            this.triggerSingleton('show-modal',
                new NodeConfigModal(this.currentTreeNode, config))
        }

        private addNode() {
            Progress.start()
            if (isDef(this.currentTreeNode)) {
                this.createChildNode()
            } else {
                this.createNode()
            }
        }

        @On({event: 'keydown', selector: '.tree-view'})
        keyEvent(ev: KeyboardEvent) {
            if (isDef(this.currentTreeNode) && /[+c]|(left|right|up|down|enter)$/i.test(ev.key) &&
                matches(document.activeElement, 'li.tree-node')) {
                ev.preventDefault()
                if ('+' === ev.key) {
                    this.addNode()
                }
                if ('c' === ev.key) {
                    this.configureNode()
                }
                if (/left$/i.test(ev.key)) {
                    this.currentTreeNode.open = false
                }
                if (/right$/i.test(ev.key)) {
                    this.currentTreeNode.open = true
                }
                if (/(down|up)$/i.test(ev.key)) {
                    const allNodes = this
                        .allNodes(this.nodes)
                        .filter(n => !n.parent || n.allParentsOpen())
                    const dir = /down$/i.test(ev.key) ? 1 : -1
                    const nextNode = allNodes[
                        allNodes.findIndex(v => v === this.currentTreeNode) + dir
                    ]
                    if (nextNode) {
                        this.nodeSelected(nextNode)
                        const el = this.element.querySelector('.tree-node > .selected')
                        scrollElementIntoView(el as HTMLDivElement)
                    }
                }
                if (/enter$/i.test(ev.key)) {
                    this.currentTreeNode.focusAndEdit()
                }
            }
        }

        @Template()
        projectPage() {
            return `
            <panel class="fullscreen v-flex">
                <navigation class="no-grow"></navigation>
                    <horizontal-split class="grow" id="app-split">
                      <sidebar class="v-flex">
                        <tree-actions></tree-actions>
                        <scroll-spy class="grow" {{loading}}>
                          <aside class="menu">
                            <selectable-tree-label label="Structure" selected={true} type="structure"></selectable-tree-label>
                            <ul class="tree-view is-marginless" {{nodes}}></ul>
                            <selectable-tree-label label="Schemas" selected={false} type="schema"></selectable-tree-label>
                            <ul class="tree-view is-marginless" {{schemaNodes}}></ul>
                          </aside>
                        </scroll-spy>
                      </sidebar>
                      <section class="v-flex value-section">
                         <value-editor class="grow v-flex"/>
                      </section>
                    </horizontal-split>
                </scroll-pane>
                <footer class="no-grow app-footer"/>
            </panel>`
        }

        private allNodes(nodes: CustomTreeNode[]) {
            return [].concat(...nodes.map(flattenTree))
        }
    }
}
