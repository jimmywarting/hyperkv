var test = require('tape')
var memdb = require('memdb')
var hyperlog = require('hyperlog')
var sub = require('subleveldown')
var Hyperkv = require('../index.js')

test('empty get', function (t) {
  t.plan(2)
  var db = memdb()
  var kv = new Hyperkv({
    log: hyperlog(sub(db, 'log'), { valueEncoding: 'json' }),
    db: sub(db, 'kv')
  })
  kv.get('A', function (err, values) {
    t.ifError(err)
    t.deepEqual(values, {})
  })
})
