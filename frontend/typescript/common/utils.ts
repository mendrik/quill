module quill {

    import TreeNodeIcon = feather.ui.tree.TreeNodeIcon
    import findClippedParent = feather.ui.findClippedParent;

    const urlParams = {}

    const popstate = () => {
        const pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) {
                return decodeURIComponent(s.replace(pl, ' '))
            },
            query = window.location.search.substring(1)
        let match
        while (match = search.exec(query)) {
            urlParams[decode(match[1])] = decode(match[2])
        }
    }

    window.addEventListener('popstate', popstate)
    popstate()

    export const getQueryStringParam = (key: string) => urlParams[key]

    export const iconFor = (type: NodeType): TreeNodeIcon => {
        switch (type) {
            case 'string':
                return TreeNodeIcon.text
            case 'number':
                return TreeNodeIcon.number
            case 'enum':
                return TreeNodeIcon.enum
            case 'list':
                return TreeNodeIcon.array
            case 'node':
                return TreeNodeIcon.object
            case 'boolean':
                return TreeNodeIcon.boolean
        }
    }

    export interface HasChildren<T> {
        children: HasChildren<T>[]
    }

    export const flattenTree = <T>(node: HasChildren<T>) =>
        [node].concat(...node.children.map(flattenTree))

    export const scrollElementIntoView = (el: HTMLElement) => {
        const scroll = findClippedParent(el),
              scrollRect = scroll.getBoundingClientRect(),
              rect = el.getBoundingClientRect()
        if (rect.top <= scrollRect.top || rect.bottom >= scrollRect.bottom) {
                el.scrollIntoView()
        }

    }
}
