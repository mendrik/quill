module quill {

    import Construct                    = feather.annotations.Construct
    import Template                     = feather.annotations.Template
    import On                           = feather.event.On
    import GestureWidget                = feather.ui.events.GestureWidget
    import Subscribe                    = feather.hub.Subscribe
    import addMultipleEventListeners    = feather.ui.events.addMultipleEventListeners
    import removeMultipleEventListeners = feather.ui.events.removeMultipleEventListeners
    import tapEvents                    = feather.ui.events.tapEvents
    import Rest                         = feather.xhr.Rest

    @Construct({selector: 'navigation', singleton: true})
    export class Navigation extends GestureWidget {

        constructor() {
            super()
            this.closeHandler = this.closeHandler.bind(this)
        }

        init() {
            this.render()
        }

        @On({event: 'tap', selector: '.navbar-toggle'})
        toggle(ev, el) {
            this.toggleActiveState()
            if (el.classList.contains('is-active')) {
                addMultipleEventListeners(tapEvents, document, this.closeHandler)
            } else {
                removeMultipleEventListeners(tapEvents, document, this.closeHandler)
            }
        }

        closeHandler(ev) {
            const el = this.element
            if (!el.contains(ev.target as Element)) {
                this.toggleActiveState()
                removeMultipleEventListeners(tapEvents, document, this.closeHandler)
            }
        }

        toggleActiveState() {
            const el = this.element.querySelector('.navbar-toggle')
            el.classList.toggle('is-active')
            const menu = this.element.querySelector('.navbar-menu')
            menu.classList.toggle('is-active')
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

        @Subscribe('xhr-failure-401')
        logoutFailed() {
            removeToken()
            this.route('/login')
        }

        @Template()
        markup() {
            return `
            <nav class="navbar" role="navigation" aria-label="main navigation">
              <div class="navbar-brand">
                <a class="navbar-item" href="/" id="logo">
                    <img src="/assets/images/quill.svg" alt="Quill Logo">
                    <span>Quill</span><span>{{project.name}}</span>
                </a>
                <div class="navbar-burger navbar-toggle">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div class="navbar-menu">
                <div class="navbar-end">
                    <a class="navbar-item logout">Logout <span class="username">{{user.firstname}}</span></a>
                    <a class="navbar-item">Documentation</a>
                    <div  class="navbar-item">
                        <p class="control has-icons-right" id="search">
                          <input class="input" type="text" placeholder="Search...">
                          <Icon name="search" align-right="right"></Icon>
                        </p>
                    </div>
                </div>
              </div>
            </nav>
            `
        }
    }
}
