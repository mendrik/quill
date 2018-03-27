module quill {

    import Construct  = feather.annotations.Construct
    import ScrollPane = feather.ui.ScrollPane
    import On         = feather.event.On
    import Scope      = feather.event.Scope

    @Construct({selector: 'scroll-spy'})
    export class ScrollSpy extends ScrollPane {

        @On({event: 'scroll', scope: Scope.Direct})
        onScroll(ev) {
        }

    }
}
