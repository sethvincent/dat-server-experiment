var EOL = require('os').EOL
var datServer = require('../index')

module.exports = listen

listen.usage = ['dat-server listen [--port=<port>]', 'Start a dat server'].join(EOL)

function listen(dat, opts, cb) {
  var server = datServer(dat)
  server.listen(opts.port, opts, function(err, port) {
    if (err) return cb(err)
    console.log('Listening on port ' + port)
    // do not call the cb as we want to keep being open
  })
}