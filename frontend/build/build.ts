import * as UglifyJS from 'uglify-js'
import * as fs from 'fs'

console.log(' *** building frontend ***')

const feather = fs.readFileSync('node_modules/feather-ts/feather.min.js', 'utf-8')
const components = fs.readFileSync('node_modules/feather-components/feather-components.min.js', 'utf-8')
const quill = fs.readFileSync('out/quill.js', 'utf-8')

const minified = UglifyJS.minify([feather, components, quill])

fs.writeFileSync('out/quill.min.js', minified.code)

console.log(' *** copy to public ***')

fs.createReadStream('out/quill.min.js')
    .pipe(fs.createWriteStream('../public/quill.min.js'))

fs.createReadStream('out/styles.css')
    .pipe(fs.createWriteStream('../public/styles.css'))

fs.createReadStream('node_modules/feather-components/feather-components.css')
    .pipe(fs.createWriteStream('../public/feather-components.css'))

fs.createReadStream('node_modules/bulma/css/bulma.css')
    .pipe(fs.createWriteStream('../public/bulma.css'))
