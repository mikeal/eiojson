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


var bindServer = require('./server')
  , bindClient = require('./client')
  ;

if (engine.listen) {
  wrap(engine, 'listen', bindServer)
  wrap(engine, 'attach', bindServer)
}

exports.server = engine

exports.client = function () {
  return bindClient(eioclient.apply(eioclient, arguments))
}

exports.bindClient = bindClient
exports.bindServer = bindServer
