if (window['Element'] && !Element.prototype.closest) {
    Element.prototype.closest = (s) => {
        const matches = (this.document || this.ownerDocument).querySelectorAll(s)
        let i,
            el = this
        do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) {
                //
            }
        } while ((i < 0) && (el = el.parentElement))
        return el
    }
}
