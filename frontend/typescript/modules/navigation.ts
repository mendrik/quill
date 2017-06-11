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

        constructor() {
            super()
            this.closeHandler = this.closeHandler.bind(this)
        }

        init() {
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

        @Rest({url: '/signout', method: Method.POST, body: 'credentials', headers: quill.headers})
        doLogout(resp?: any) {
            removeToken()
            this.route('/login')
        }

        @Template()
        markup() {
            return (`
            <nav class="nav">
              <div class="nav-left">
                <a class="nav-item" href="/" id="logo">Quill</a>
              </div>
              <span class="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <div class="nav-right nav-menu">
                <a class="nav-item logout">Logout</a>
                <a class="nav-item">Documentation</a>
                <div  class="nav-item">
                    <p class="control has-icons-right" id="search">
                      <input class="input" type="text" placeholder="Search...">
                      <span class="icon is-right">
                        <i class="fa fa-search"></i>
                      </span>
                    </p>
                </div>
              </div>
            </nav>
            `)
        }

    }
}
