module quill.components {

    import GestureWidget = feather.ui.events.GestureWidget
    import Construct = feather.annotations.Construct
    import Subscribe = feather.hub.Subscribe
    import On = feather.event.On
    import TypedMap = feather.types.TypedMap
    import Rest = feather.xhr.Rest
    import Bind = feather.observe.Bind
    import Template = feather.annotations.Template

    @Construct({selector: 'selectable-tree-label', attributes: ['label', 'selected', 'group']})
    export class SelectableTreeLabel extends GestureWidget {

        @Bind() selected: boolean
        @Bind() label: string
        group: string

        constructor(label: string, selected: boolean, group: string) {
            super();
            this.label = label;
            this.selected = selected;
            this.group = group;
        }

        init() {
            this.render()
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

    }
}
