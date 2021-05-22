var Hyperkv = require('../index.js')
var hyperlog = require('hyperlog')
var sub = require('subleveldown')

var level = require('level')
var db = level('/tmp/kv.db')

var kv = new Hyperkv({
  log: hyperlog(sub(db, 'log'), { valueEncoding: 'json' }),
  db: sub(db, 'kv')
})

var key = process.argv[2]
var value = process.argv[3]

kv.put(key, value, function (err, node) {
  if (err) console.error(err)
  else console.log(node.key)
})
