var data = '{data}'
var srcs = ['iana', 'apache', 'nginx']
var comp = [false, true]
var char = ['UTF-8', '7-BIT']
var family
var db = module.exports = {}
data.split('\n').map(line => {
  if (line[0] === '/') {
    var items = line.split(' ')
    var mime = items.shift()
    var attrs = items.shift()
    var props = {}
    if (attrs[0] !== '-') {
      props.source = srcs[+attrs[0]]
    }
    if (attrs[1] !== '-') {
      props.compressible = comp[+attrs[1]]
    }
    if (attrs[2] !== '-') {
      props.charset = char[+attrs[2]]
    }
    if (items.length) {
      props.extensions = items
    }
    db[family + mime] = props
  } else {
    family = line
  }
})
