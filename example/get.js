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
kv.get(key, function (err, value) {
  if (err) console.error(err)
  else console.log(value)
})
