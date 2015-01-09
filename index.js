var debug = require('debug')('dat-server')

var Dat = require('dat')
var getPort = require('dat/lib/get-port.js')
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

DatServer.prototype.close = function () {
  var self = this
  if (self._server) {
    rmPort()

    // since the server process can't exit yet we must manually close stdout
    stdout.end()

    // if there aren't any active connections then we can close the server
    if (self.dat._connections.sockets.length === 0) {
      self.dat._connections.destroy()
      self._server.close()
    }

    // otherwise wait for the current connections to close
    self.dat._connections.on('idle', function() {
      debug('dat close due to idle')
      self.dat._connections.destroy()
      self._server.close()
      rmPort()
    })

    function rmPort() {
      fs.unlink(self.dat.paths().port, function(err) {
        // ignore err
        cb()
      })
    }
  }
}
