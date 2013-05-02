var broquire = require('broquire')(require)

exports.wrap = function wrap (obj, name, fn) {
  var old = obj[name]
  obj[name] = function () {return fn(old.apply(obj, arguments))}
}

exports.server = broquire('./server')
exports.client = require('./client')