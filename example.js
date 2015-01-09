/*


// pass actual dat
var dat = require('dat')('./db', function () {
  var server = require('./')(dat)

  server.listen(3333, function() {
    console.log('Listening at 127.0.0.1:3333')
  })
})

*/


// pass dat options
var createDatServer = require('./')

var server = createDatServer('./db', function () {
  server.listen(3333, function () {
    console.log('Listening at 127.0.0.1:3333')
  })
})
