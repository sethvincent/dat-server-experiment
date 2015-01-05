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

Example usage:

```
var dat = require('dat')('./db', function () {
  var server = require('dat-server-experiment')(dat);
  server.listen(3333, function () {
    console.log('dat server listening at 127.0.0.1:3333')
  })
})
```