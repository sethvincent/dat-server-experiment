
module.exports.listen = function(test, common) {
  test('CLI dat listen', function(t) {
    if (common.rpc) return t.end()
    common.destroyTmpDats(function() {
      mkdirp(common.dat1tmp, function(err) {
        t.notOk(err, 'no err')
        var dat = spawn(datCliPath, ['init', '--no-prompt'], {cwd: common.dat1tmp, env: process.env})
        getFirstOutput(dat.stdout, verify)

        function verify(output) {
          var dat2 = spawn(datCliPath, ['listen'], {cwd: common.dat1tmp, env: process.env})
          getFirstOutput(dat2.stdout, verify2)

          function verify2(output2) {
            request({url: 'http://localhost:6461/api', json: true}, function(err, resp, json) {
              t.ok(json && !!json.version, 'got json response')
              kill(dat.pid)
              kill(dat2.pid)
              common.destroyTmpDats(function() {
                t.end()
              })
            })
          }
        }
      })
    })
  })
}

module.exports.listenEmptyDir = function(test, common) {
  test('CLI dat listen in empty dir (not a dat dir)', function(t) {
    if (common.rpc) return t.end()
    common.destroyTmpDats(function() {
      mkdirp(common.dat1tmp, function(err) {
        t.notOk(err, 'no err')
        var dat = spawn(datCliPath, ['listen'], {cwd: common.dat1tmp})

        getFirstOutput(dat.stderr, verify)

        function verify(output) {
          var gotError = output.indexOf('There is no dat here') > -1
          t.ok(gotError, 'got error')
          if (!gotError) console.log('Output:', output)
          kill(dat.pid)
          common.destroyTmpDats(function() {
            t.end()
          })
        }
      })
    })
  })
}

module.exports.listenPort = function(test, common) {
  test('CLI dat listen custom port', function(t) {
    if (common.rpc) return t.end()
    common.destroyTmpDats(function() {
      mkdirp(common.dat1tmp, function(err) {
        t.notOk(err, 'no err')
        var dat = spawn(datCliPath, ['init', '--no-prompt'], {cwd: common.dat1tmp, env: process.env})
        getFirstOutput(dat.stdout, verify)

        function verify(output) {
          var dat2 = spawn(datCliPath, ['listen', '--port=9000'], {cwd: common.dat1tmp, env: process.env})
          getFirstOutput(dat2.stdout, verify2)

          function verify2(output2) {
            request({url: 'http://localhost:9000/api', json: true}, function(err, resp, json) {
              t.ok(json && !!json.version, 'got json response')
              kill(dat.pid)
              kill(dat2.pid)
              common.destroyTmpDats(function() {
                t.end()
              })
            })
          }

        }
      })
    })
  })
}

module.exports.all = function(test, common) {
  module.exports.listen(test, common)
  module.exports.listenEmptyDir(test, common)
  module.exports.listenPort(test, common)
}

