module quill {

    import Construct = feather.annotations.Construct
    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import On = feather.event.On
    import GestureWidget = feather.ui.events.GestureWidget
    import Subscribe = feather.hub.Subscribe
    import TreeNode = feather.ui.tree.TreeNode
    import addMultipleEventListeners = feather.ui.events.addMultipleEventListeners
    import removeMultipleEventListeners = feather.ui.events.removeMultipleEventListeners
    import tapEvents = feather.ui.events.tapEvents
    import Rest = feather.xhr.Rest
    import Method = feather.xhr.Method

    @Construct({selector: 'navigation'})
    export class Navigation extends GestureWidget {

        @Bind() userName = ""
        @Bind() projectName = ""

        constructor() {
            super()
            this.closeHandler = this.closeHandler.bind(this)
        }

        init() {
            this.userName = findParentValue<User>(this, 'user').firstname
            this.render()
        }

        @On({event: 'tap', selector: '.nav-toggle'})
        toggle(ev, el) {
            this.toggleActiveState();
            if (el.classList.contains('is-active')) {
                addMultipleEventListeners(tapEvents, document, this.closeHandler)
            } else {
                removeMultipleEventListeners(tapEvents, document, this.closeHandler)
            }
        }

        closeHandler(ev) {
            const el = this.element;
            if (!el.contains(ev.target as Element)) {
                this.toggleActiveState()
                removeMultipleEventListeners(tapEvents, document, this.closeHandler)
            }
        }

        toggleActiveState() {
            const el = this.element.querySelector('.nav-toggle');
            el.classList.toggle('is-active')
            el.nextElementSibling.classList.toggle('is-active')
        }

        @On({event: 'tap', selector: 'a.logout'})
        logoutClicked() {
            this.doLogout()
        }

        @Rest({url: '/signout', headers: quill.headers})
        doLogout() {
            removeToken()
            this.route('/login')
        }

        @Subscribe('xhr-failure')
        logoutFailed() {
            removeToken()
            this.route('/login')
        }

        @Subscribe('project-loaded')
        projectLoaded(project: Project) {
            this.projectName = project.name
        }

        @Template()
        markup() {
            return (`
            <nav class="nav">
              <div class="nav-left">
                <a class="nav-item" href="/" id="logo">
                    <img src="/assets/images/quill.svg" alt="Quill Logo">
                    Quill {{projectName:withDash}}
                </a>
              </div>
              <span class="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <div class="nav-right nav-menu">
                <a class="nav-item logout">Logout ({{userName}})</a>
                <a class="nav-item">Documentation</a>
                <div  class="nav-item">
                    <p class="control has-icons-right" id="search">
                      <input class="input" type="text" placeholder="Search...">
                      <Icon name="search" align-right="right"></Icon>
                    </p>
                </div>
              </div>
            </nav>
            `)
        }

        withDash = (txt: string) => txt.trim() ? `- ${txt}` : txt
    }
}
