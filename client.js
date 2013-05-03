var saferStringify = require('./').saferStringify

function binder (stream) {
  stream.on('data', function (data) {
    var obj
    try { obj = JSON.parse(data.toString) }
    catch (e) { stream.emit('error', e); return}
    stream.emit('json', obj)
  })
  stream.json = function (obj) {
    stream.send(saferStringify(obj))
  }
  return stream
}

module.exports = binder