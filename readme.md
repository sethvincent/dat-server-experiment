experimenting with taking the REST server out of dat and making it a standalone module.

changed very little so far aside from updating routes-router and fixing a small related bug where `opts.key` wasn't available in the route handlers so switched to `opts.params.key`.

## To run:

- clone this repo
- `cd` into repo
- `npm install`
- `npm start`

## To use as a module:

`npm i --save sethvincent/dat-server-experiment`

_(note that this installs from github because this module isn't on npm)_

## Example usage:

Pass a dat instance:

```js
var Dat = require('dat')
var createDatServer = require('dat-server-experiment')

var dat = Dat('./db', function () {
  var server = createDatServer(dat)
  
  server.listen(3333, function() {
    console.log('Listening at 127.0.0.1:3333')
  })
})
```

Pass a path to dat that exists on the filesystem:

```js
var createDatServer = require('dat-server-experiment')

var server = createDatServer('./db', function () {
  server.listen(3333, function () {
    console.log('Listening at 127.0.0.1:3333')
  })
})
```