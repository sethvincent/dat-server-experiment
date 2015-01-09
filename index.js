var debug = require('debug')('dat-server')

var fs = require('fs')
var Dat = require('dat')
var getPort = require('lib/get-port.js')
var connections = require('connections')
var stdout = require('stdout-stream')

var restHandler = require('./components/handler')
var restRouter = require('./components/router')
var restServer = require('./components/server')

module.exports = DatServer

function DatServer (dir, opts, onReady) {
  if (!(this instanceof DatServer)) return new DatServer(dir, opts, onReady)

  // there's probly a better way of determining if an object is a dat:
  if (dir.exists) this.dat = dir
  else this.dat = Dat(dir, opts, onReady)
}

DatServer.prototype.listen = function(port, options, cb) {
  if (typeof port === 'function') return this.listen(0, null, port) // dat.listen(cb)
  if (typeof port === 'object' && port) return this.listen(0, port, options) // dat.listen(options, cb)
  if (typeof options === 'function') return this.listen(port, null, options) // dat.listen(port, cb)
  if (!options) options = {}
  if (!cb) cb = noop

  var self = this
  var dat = this.dat

  if (process.env.PORT && !port) port = parseInt(process.env.PORT)

  // if already listening then return early w/ success callback
  if (this._server && this._server.address()) {
    setImmediate(function() {
      cb(null, self.address().port)
    })
    return
  }

  this.dat._ensureExists(options, function exists(err) {
    if (err) return cb(false, err)
    var handler = restHandler(self.dat)
    var router = restRouter(handler)
    self._server = restServer(router)
    self.dat._server = self._server

    // track open connections so we can gracefully close later
    self.dat._connections = connections(self._server)

    // hook up stats collection
    self.dat.stats.http(self._server)

    // runs import + listen hooks if they exist
    self.dat.startImport()
    self.dat.listenHook(dat, listen)

    function listen(err) {
      if (err) return cb(err)
      var startingPort = port || self.dat.options.port
      getPort(startingPort, self.dat.paths().port, function(err, port) {
        if (err) return cb(err)
        debug('listen', { hostname: self.dat.options.hostname, port: port })

        self._server.listen(port, self.dat.options.hostname, function(err) {
          if (err) return cb(err)
          cb(null, port)
        })
      })
    }
  })
}

DatServer.prototype.running = function () {
  return this._server && this._server.address() !== null
}

