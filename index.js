var Dat = require('dat')

var restHandler = require('./components/handler')
var restRouter = require('./components/router')
var restServer = require('./components/server')

module.exports = function (dir, opts, onReady) {
  // if dir is actuall a dat instance
  if (dir.exists) return createServer(dir)

  // else we're passing options to create a dat
  else {
    var dat = Dat(dir, opts, onReady)
    return createServer(dat)
  }
}

function createServer (dat) {
  var handler = require('./components/handler')(dat)
  var router = require('./components/router')(handler)
  var server = require('./components/server')(router)

  return server
}

