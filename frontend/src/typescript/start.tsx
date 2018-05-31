import {h, render} from 'preact'
import {domReady, initTranslations, fetchJson} from 'preact-quill'
import {Application} from './ui/application'

(async () => {
    const [locales] = await Promise.all([
        fetchJson('/translations'),
        domReady()
    ])
    initTranslations(locales)
    render(<Application/>, document.body)
})()
