var eiojson = require('./index')
  , cleanup = require('cleanup')
  , assert = require('assert')
  , _ = require('lodash')
  , ok = require('okdone')
  ;

var d = cleanup(function (error) {
  if (error) process.exit(1)
  ok.done()
  process.exit()
})

var t = {test:1}

var types =
  [ null
  , 'string'
  , {test:'simple object'}
  , ['something', 1, 'funny']
  , {test1: t, test2: t}
  ]

types = types.concat(types)

var count = Object.keys(types).length
  , completed = 0
  ;

function listener (obj) {
  assert.deepEqual(obj, types[completed])
  ok(JSON.stringify(types[completed]))
  completed += 1
  if (completed === count) {
    d.cleanup()
  }
}

function test (c) {
  _.each(types, function (t) {
    c.json(t)
  })
  // assert.deepEqual and _.clone treat circular refs differently
}

var s = eiojson.server.listen(8080, function () {
  var c = eiojson.client('ws://localhost:8080')
  c.on('json', listener)
  test(c)
})

s.on('connection', function (socket) {
  socket.on('json', listener)
  test(socket)
})
