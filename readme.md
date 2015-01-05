experimenting with taking the REST server out of dat and making it a standalone module.

changed very little so far aside from updating routes-router and fixing a small related bug where `opts.key` wasn't available in the route handlers so switched to `opts.params.key`.

## To run:

- clone this repo
- `cd` into repo
- `npm install`
- `node index.js`