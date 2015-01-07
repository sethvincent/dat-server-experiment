module.exports = function (dat) {
  var handler = require('./components/handler')(dat)
  var router = require('./components/router')(handler)
  var server = require('./components/server')(router)

  return server
}


