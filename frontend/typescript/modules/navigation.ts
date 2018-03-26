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

        init() {
            this.render()
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
                    <span>Quill</span>
                    <span>{{project.name}}</span>
                </a>
              </div>
              <div class="navbar-end">
                <a class="navbar-item settings"><Icon name="cog"/>Settings</span></a>
                <a class="navbar-item logout"><Icon name="sign-out"/>Logout <span class="username">{{user.firstname}}</span></a>
                <div  class="navbar-item">
                <p class="control has-icons-right" id="search">
                  <input class="input" type="text" placeholder="Search...">
                  <Icon name="search" align-right="right"></Icon>
                </p>
                </div>
              </div>
            </nav>
            `
        }
    }
}
