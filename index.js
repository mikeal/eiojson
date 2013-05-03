var _ = require('lodash')

// Deep copy objects before stringifying
// - removes circular references
function saferStringify (obj) {
  return JSON.stringify(_.clone(obj, true))
}
exports.saferStringify = saferStringify

function createListener (stream) {
  function listener (data) {
    var obj
    try { obj = JSON.parse(data.toString()) }
    catch (e) {
      // Userful for debugging but can't throw on uncaught.
      // stream.emit('error', e)
      return
    }
    stream.emit('json', obj)
    return data
  }
  return listener
}

function createWrite (stream) {
  return function (obj) { return stream.send(saferStringify(obj)) }
}

function binder (stream) {
  stream.on('data', createListener(stream))
  stream.json = createWrite(stream)
  return stream
}

module.exports = binder
