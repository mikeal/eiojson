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

  // this must be last
  , ['circular', types]
  ]

var s = eiojson.server.listen(8080, function () {
  var c = eiojson.client('ws://localhost:8080')
  _.each(types, function (t) {
    c.json(t)
  })
  // assert.deepEqual and _.clone treat circular refs differently
  types[types.length - 1] = JSON.parse(JSON.stringify(_.clone(types[types.length - 1], true)))
})

s.on('connection', function (socket) {
  var count = Object.keys(types).length
    , completed = 0
    ;

  socket.on('json', function (obj) {
    assert.deepEqual(obj, types[completed])
    ok(JSON.stringify(types[completed]))
    completed += 1
    if (completed === count) {
      d.cleanup()
    }
  })
})
