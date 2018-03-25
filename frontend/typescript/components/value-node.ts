module quill {

    import TreeNode = feather.ui.tree.TreeNode;
    import Template = feather.annotations.Template;

    export class ValueNode extends TreeNode<Node> implements HasChildren<TreeNode<Node>> {

        @Template()
        markup() {
            return '<li></li>'
        }
    }
}

