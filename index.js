var broquire = require('broquire')(require)
  , eioclient = broquire('engine.io-client', 'eio')
  , _ = require('lodash')
  , engine = _.clone(broquire('engine.io', {}))
  ;

function wrap (obj, name, fn) {
  var old = obj[name]
  obj[name] = function () {return fn(old.apply(obj, arguments))}
}
exports.wrap = wrap

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

function bindServer (server) {
  server.on('connection', function (socket) {
    binder(socket)
  })
  return server
}

if (engine.listen) {
  wrap(engine, 'listen', bindServer)
  wrap(engine, 'attach', bindServer)
}

exports.server = engine

exports.client = function () {
  return binder(eioclient.apply(eioclient, arguments))
}

exports.binder = binder
exports.bindClient = binder
exports.bindServer = bindServer
