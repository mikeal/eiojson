var _ = require('lodash')
  , saferStringify = require('./').saferStringify
  ;
  
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

module.exports = binder



//
// server.on('connection', function (socket) {
//   socket.on('message', function () { });
//   socket.on('close', function () { });
// });

