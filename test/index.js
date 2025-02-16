
var assert = require('assert')
var fs = require('fs')
var join = require('path').join
var typer = require('media-typer')

var db = require('..')
var dbMin = require('../db.min.js')

describe('mime-db', function () {
  it('should not contain types not in src/', function () {
    var path = join(__dirname, '..', 'src')
    var types = []

    // collect all source types
    fs.readdirSync(path).forEach(function (file) {
      if (!/-types\.json$/.test(file)) return
      types.push.apply(types, Object.keys(require(path + '/' + file)))
    })

    Object.keys(db).forEach(function (name) {
      assert.ok(types.indexOf(name) !== -1, 'type "' + name + '" should be in src/')
    })
  })

  it('should contain only valid mime types', function () {
    Object.keys(db).forEach(function (mime) {
      assert.ok(typer.test(mime), 'type "' + mime + '" is a valid mime type')
    })
  })

  it('should not have any uppercased letters in names', function () {
    Object.keys(db).forEach(function (name) {
      assert.strictEqual(name, name.toLowerCase(), 'type "' + name + '" should be lowercase')
    })
  })

  it('should have .json and .js as having UTF-8 charsets', function () {
    assert.strictEqual('UTF-8', db['application/json'].charset)
    assert.strictEqual('UTF-8', db['application/javascript'].charset)
  })

  it('should set audio/x-flac with extension=flac', function () {
    assert.strictEqual('flac', db['audio/x-flac'].extensions[0])
  })

  it('should have guessed application/mathml+xml', function () {
    // because it doesn't have a "template"
    assert(db['application/mathml+xml'])
  })

  it('should not have an empty .extensions', function () {
    assert(Object.keys(db).every(function (name) {
      var mime = db[name]
      if (!mime.extensions) return true
      return mime.extensions.length
    }))
  })

  it('should have only lowercase .extensions', function () {
    Object.keys(db).forEach(function (name) {
      (db[name].extensions || []).forEach(function (ext) {
        assert.strictEqual(ext, ext.toLowerCase(), 'extension "' + ext + '" in type "' + name + '" should be lowercase')
      })
    })
  })

  it('should have the default .extension as the first', function () {
    assert.strictEqual(db['text/plain'].extensions[0], 'txt')
    assert.strictEqual(db['video/x-matroska'].extensions[0], 'mkv')
  })
})

describe('db.min.js', function () {
  it('should be equivalent to db.json', function () {
    assert.deepStrictEqual(db, dbMin)
  })
})
