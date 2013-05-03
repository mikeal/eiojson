var broquire = require('broquire')(require)
  , eioclient = broquire('engine.io-client', 'eio')
  , engine = broquire('engine.io', {})
  , _ = require('lodash')
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
    catch (e) { stream.emit('error', e); return}
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
