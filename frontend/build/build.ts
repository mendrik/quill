import * as UglifyJS from 'uglify-js'
import * as fs from 'fs'
import * as zlib from 'zlib'

console.log(' *** building frontend ***')

const feather = fs.readFileSync('node_modules/feather-ts/feather.min.js', 'utf-8')
const components = fs.readFileSync('feather-components/feather-components.js', 'utf-8')
const quill = fs.readFileSync('out/quill.js', 'utf-8')

const minified = UglifyJS.minify([feather, components, quill])

fs.writeFileSync('out/quill.min.js', minified.code)

const compressor1 = zlib.createGzip({level: 1})
compressor1.pipe(fs.createWriteStream('out/quill.min.js.gz'))
compressor1.end(minified.code)

const compressor2 = zlib.createGzip({level: 1})
compressor2.pipe(fs.createWriteStream('out/styles.css.gz'))
compressor2.end(fs.readFileSync('out/styles.css', 'utf-8'))

console.log(' *** copy to public ***')

fs.createReadStream('out/quill.min.js.gz').pipe(fs.createWriteStream('../public/quill.min.js.gz'));
fs.createReadStream('out/styles.css.gz').pipe(fs.createWriteStream('../public/styles.css.gz'));
fs.createReadStream('out/quill.min.js').pipe(fs.createWriteStream('../public/quill.min.js'));
fs.createReadStream('out/styles.css').pipe(fs.createWriteStream('../public/styles.css'));
fs.createReadStream('node_modules/bulma/css/bulma.css').pipe(fs.createWriteStream('../public/bulma.css'));
