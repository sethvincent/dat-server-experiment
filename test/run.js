var common = require('dat/test/common')()
var tape = require('tape')

function test(name, testFunction) {
  return tape(common.testPrefix + name, testFunction)
}

// resets any existing DB
test('setup', function(t) {
  common.destroyTmpDats(function() {
    t.end()
  })
})

if (process.env['RPC']) {
  common.rpc = true
  common.testPrefix = 'RPC: '
}

var tests = [
  require('./rest.js'),
  require('./cli.js')
]

function runAll() {
  tests.map(function(t) {
    t.all(test, common)
  })
}

runAll()