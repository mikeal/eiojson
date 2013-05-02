var broquire = require('broquire')(require)
  , client = broquire('engine.io-client', 'eio')
  , _ = require('lodash')
  , events = require('events')
  ;


// Deep copy objects before stringifying
// - removes circular references
function saferStringify (obj) {
  return JSON.stringify(_.clone(obj, true))
}

module.exports = function () {
  var stream = client.apply(client, arguments)

  stream.on('data', function (data) {
    var obj
    try { JSON.parse(data.toString) }
    catch (e) { stream.emit('error', e); return}
    stream.emit('json', obj)
  })
  stream.json = function (obj) {
    stream.send(saferStringify(obj))
  }
  return stream
}