const fs = require('fs')
const path = require('path')

const sources = ['iana', 'apache', 'nginx']
const compression = [false, true]
const charsets = ['UTF-8', '7-BIT']

module.exports = function writeDatabaseMinSync (fileName, obj) {
  let lastFamily = null
  let data = ''
  const sortedEntries = Object.entries(obj).sort(function (a, b) {
    return a[0].localeCompare(b[0])
  })
  for (const [mime, item] of sortedEntries) {
    const [family, child] = mime.split('/')
    if (family !== lastFamily) {
      data += `${family}\n`
    }
    const extensions = item.extensions ? ' ' + item.extensions.join(' ') : ''
    const srcIdx = sources.indexOf(item.source)
    const compIdx = compression.indexOf(item.compressible)
    const charIdx = charsets.indexOf(item.charset)
    const src = srcIdx === -1 ? '-' : srcIdx
    const comp = compIdx === -1 ? '-' : compIdx
    const char = charIdx === -1 ? '-' : charIdx
    data += `/${child} ${src}${comp}${char}${extensions}\n`
    lastFamily = family
  }
  const warning = '// THIS FILE IS AUTO-GENERATED: DO NOT EDIT\n'
  const expander = warning + fs.readFileSync(path.join(__dirname, 'expander.js'), 'utf8')
  const output = expander.replace("'{data}'", `\`${data}\``)
  fs.writeFileSync(fileName, output)
}

/*

Example minification:
----------------------------
family1
/mime1 0-- ext1 ext2 ext3
/mime2 112 ext4 ext5 ext6
family2
/mime3 000 ext7 ext8 ext9
/mime4 --- ext10 ext11 ext12
----------------------------

Explanation of minification:
----------------------------
"family1" is the family name of the mime types that follow
"/mime1" refers to the mime type "family1/mime1"
Following the space, the next 3 characters indicate:
  1. The source of the mime type (0 = iana, 1 = apache, 2 = nginx, - = undefined)
  2. Whether the mime type is compressible (0 = false, 1 = true, - = undefined)
  3. The charset of the mime type (0 = UTF-8, 1 = 7-BIT, - = undefined)
Following the space, the next characters are the extensions, separated by spaces

*/
