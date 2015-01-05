var dat = require('dat')('./db', function () {
  var server = require('./')(dat);
  server.listen(3333, function () {
    console.log('dat server listening at 127.0.0.1:3333')
  })
})
