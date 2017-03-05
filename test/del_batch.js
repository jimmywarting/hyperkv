var test = require('tape')
var hyperkv = require('../')
var memdb = require('memdb')
var hyperlog = require('hyperlog')

test('batch', function (t) {
  t.plan(6)

  var kv = hyperkv({
    log: hyperlog(memdb(), { valueEncoding: 'json' }),
    db: memdb()
  })
  kv.batch([
    { type: 'put', key: 'A', value: 123 },
    { type: 'put', key: 'B', value: 456 },
  ], onbatch)

  var putNodes

  function onbatch (err, nodes) {
    t.error(err)
    putNodes = nodes
    kv.batch([
      { type: 'del', key: 'A', fields: { v: 900 } }
    ], onbatch2)
  }

  function onbatch2 (err, delNodes) {
    t.error(err)
    kv.get('A', function (err, values) {
      t.error(err)
      var expected = {}
      expected[delNodes[0].key] = { deleted: true, value: 900 }
      t.deepEqual(values, expected, 'expected values for key A')
    })
    kv.get('B', function (err, values) {
      t.error(err)
      var expected = {}
      expected[putNodes[1].key] = { value: 456 }
      t.deepEqual(values, expected, 'expected values for key B')
    })
  }
})

