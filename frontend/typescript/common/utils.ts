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

    const urlParams = {};

    const popstate = () => {
        const pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1)
        let match
        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
    };

    window.addEventListener('popstate', popstate)
    popstate()

    export const getQueryStringParam = (key: string) => urlParams[key]
}
