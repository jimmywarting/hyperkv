var test = require('tape')
var memdb = require('memdb')
var hyperlog = require('hyperlog')
var sub = require('subleveldown')
var collect = require('collect-stream')
var Hyperkv = require('../index.js')

test('fields', function (t) {
  t.plan(5)
  var db = memdb()
  var kv = new Hyperkv({
    log: hyperlog(sub(db, 'log'), { valueEncoding: 'json' }),
    db: sub(db, 'kv')
  })
  kv.put('A', 555, { fields: { x: 5 } }, function (err, node) {
    t.ifError(err)
    kv.get('A', { fields: true }, function (err, doc) {
      t.ifError(err)
      var expected = {}
      expected[node.key] = { k: 'A', v: 555, x: 5 }
      t.deepEqual(doc, expected, 'expected values for key A')
      collect(kv.createReadStream({ fields: true }), function (err, docs) {
        t.error(err)
        t.deepEqual(docs, [ {
          key: 'A',
          values: expected,
          links: [node.key]
        }])
      })
    })
  })
})
