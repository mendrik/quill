module quill {

    import Construct  = feather.annotations.Construct
    import ScrollPane = feather.ui.ScrollPane
    import On         = feather.event.On
    import Scope      = feather.event.Scope
    import Subscribe  = feather.hub.Subscribe

    @Construct({selector: 'scroll-spy', attributes: ['sync'], singleton: true})
    export class ScrollSpy extends ScrollPane {

        receivers: ScrollReceiver[] = []

        constructor() {
            super()
        }

        @Subscribe('register-scroll-receiver')
        registerReceiver(sr: ScrollReceiver) {
            this.receivers.push(sr)
        }

        @On({event: 'scroll', scope: Scope.Direct})
        onScroll() {
            const y = this.element.scrollTop
            this.receivers.forEach(sr => sr.scrollTo(y))
        }
    }
}
