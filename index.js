var dat = require('dat')('./db', function () {
  var handler = require('./handler')(dat)
  var router = require('./router')(handler)
  var server = require('./server')(router)

  server.listen(3333, function () {
    console.log('dat server listening at 127.0.0.1:3333')
  })
})




