module quill.components {

    import GestureWidget = feather.ui.events.GestureWidget
    import Construct = feather.annotations.Construct
    import Subscribe = feather.hub.Subscribe
    import On = feather.event.On
    import TypedMap = feather.types.TypedMap
    import Rest = feather.xhr.Rest
    import Bind = feather.observe.Bind
    import Template = feather.annotations.Template
    import removeFromArray = feather.arrays.removeFromArray

    @Construct({selector: 'selectable-tree-label', attributes: ['label', 'selected', 'group']})
    export class SelectableTreeLabel extends GestureWidget {

        static labels: SelectableTreeLabel[] = []

        @Bind() selected: boolean
        @Bind() label: string
        group: string

        constructor(label: string, selected: boolean, group: string) {
            super();
            this.label = label;
            this.selected = selected;
            this.group = group;
            SelectableTreeLabel.labels.push(this)
        }

        init() {
            this.render()
        }

        @On({event: 'tap'})
        click() {
            this.selected = true;
            SelectableTreeLabel.labels.forEach(l => {
                if (l !== this) {
                    l.selected = false
                }
            })
        }

        @Template()
        markup() {
            return (
            `<p class="menu-label clickable" {{selected}}>
                <span class="icon is-small">
                    <i class="fa fa-angle-double-right"></i>
                </span>
                {{label}}
            </p>`);
        }

        cleanUp() {
            super.cleanUp()
            removeFromArray(SelectableTreeLabel.labels, [this])
        }
    }
}
