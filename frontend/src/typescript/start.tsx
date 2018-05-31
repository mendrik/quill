import 'bulma/css/bulma.css'
import '@mdi/font/css/materialdesignicons.css'
import {h, render} from 'preact'
import {domReady, initTranslations, fetchJson} from 'preact-quill'
import {Application} from './ui/application'
import {header} from './rest/header'

(async () => {
    const [locales] = await Promise.all([
        fetchJson('/translations', {headers: header()}),
        domReady()
    ])
    initTranslations((locales as any).messages.reduce((p, c) => ({...p, [c.key]: c.value}), {}))
    render(<Application/>, document.body)
})()
