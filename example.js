/*
  


var dat = require('dat')('./db', function () {
  var server = require('./')(dat)
  
  server.listen(3333, function() {
    console.log('Listening at 127.0.0.1:3333')
  })
})

*/

var server = require('./')('./db', {}, function () {
  server.listen(3333, function () {
    console.log('Listening at 127.0.0.1:3333')
  })
});