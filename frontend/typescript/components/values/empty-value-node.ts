module quill {

    import Template = feather.annotations.Template

    export class EmptyValueNode extends ValueNode {

        @Template()
        markup() {
            return `<li class="value-line empty"/>`
        }
    }
}

