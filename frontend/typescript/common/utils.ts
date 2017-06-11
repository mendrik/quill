module quill {

    import Widget = feather.core.Widget

    export const findParentValue = <T>(widget: Widget, key: string): T => {
        let parent: Widget = widget, val: T
        while (typeof (parent = parent.parentWidget as Widget) !== 'undefined') {
            val = parent[key];
            if (typeof val !== 'undefined') {
                return val
            }
        }
    }
}
