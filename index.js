module.exports = function (dat) {
  var handler = require('./handler')(dat)
  var router = require('./router')(handler)
  var server = require('./server')(router)
  
  return server
}