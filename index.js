module.exports = function (dir, opts, onReady) {
  if (typeof dat === 'string') var dat = require('dat')(dir, opts, onReady)

  var handler = require('./components/handler')(dat)
  var router = require('./components/router')(handler)
  var server = require('./components/server')(router)

  return server
}


