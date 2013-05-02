var engine = require('engine.io')
  , _ = require('lodash')
  , wrap = require('./').wrap
  ;

function saferStringify (obj) {
  return JSON.stringify(_.clone(obj, true))
}

function binder (server) {
  server.on('connection', function (socket) {
    socket.on('message', function (data) {
      var obj
      try { obj = JSON.parse(data.toString()) }
      catch (e) { socket.emit('error', e); return}
      socket.emit('json', obj)
    })
    socket.json = function write (obj) {
      socket.send(saferStringify(obj))
    }
  })
  return server
}

wrap(engine, 'listen', binder)
wrap(engine, 'attach', binder)

module.exports = engine



//
// server.on('connection', function (socket) {
//   socket.on('message', function () { });
//   socket.on('close', function () { });
// });

