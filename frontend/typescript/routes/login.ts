module quill {

    import Widget = feather.core.Widget
    import Construct = feather.annotations.Construct
    import Template = feather.annotations.Template
    import Bind = feather.observe.Bind
    import Subscribe = feather.hub.Subscribe
    import TreeNode = feather.ui.tree.TreeNode

    export class LoginPage extends Widget {

        @Template()
        projectPage() {
            return (`
                Login
            `)
        }
    }
}
