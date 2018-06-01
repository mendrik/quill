import 'bulma/css/bulma.css'
import '@mdi/font/css/materialdesignicons.css'
import {h, render} from 'preact'
import {Application} from './ui/application'
import {header} from './rest/header'
import {fetchJson} from 'preact-quill/cjs/decorators/fetch'
import {domReady} from 'preact-quill/cjs/util/utils'
import {initTranslations} from 'preact-quill/cjs/util/localization'

(async () => {
    const [locales] = await Promise.all([
        fetchJson('/translations', {headers: header()}),
        domReady()
    ])
    initTranslations((locales as any).messages.reduce((p, c) => ({...p, [c.key]: c.value}), {}))
    render(<Application/>, document.body)
})()
