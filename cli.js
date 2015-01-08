#! /usr/bin/env node

var minimist = require('minimist')
var debug = require('debug')('dat-server.cli')
var EOL = require('os').EOL
var exit = require('exit')
var Dat = require('dat')
var datServer = require('./index')

var onerror = function(err) {
  console.error('Error: ' + err.message)
  exit(2)
}

var argv = minimist(process.argv.slice(2), {boolean: true})
var first = argv._[0] || ''
var second = argv._[1] || ''

var bin = {
  "help": './bin/help',
  "listen": './bin/listen',
}

var cmd = first

if (!bin.hasOwnProperty(first)) cmd = first + ' ' + second

if (!bin.hasOwnProperty(first) && !bin.hasOwnProperty(cmd)) {
  if(first) console.error('Command not found: ' + cmd + EOL)
  console.error("Usage: dat-server <command> [<args>]" + EOL)
  if(!first) {
    console.error('where <command> is one of:')
    Object.keys(bin).forEach(function (key) {
      console.error('  ' + key )
    })
  }
  console.error(EOL + "Enter 'dat-server <command> -h' for usage information")
  console.error("For an introduction to dat see 'dat-server help'")
  exit(1)
}

var dir = argv.path || '.' // leaky
var noDat = (first === 'version' || first === 'help')

var cmdModule = require(bin[cmd])

if(argv.h || argv.help) {
  var usage = cmdModule.usage
  if(usage) { // if it doesn't export usage just continue
    if(typeof usage == 'function') usage = usage(argv)
    console.log('Usage:', usage)
    exit()
  }
}


var dat = Dat(dir, {init: false}, function(err) {
  if (err) return onerror(err)

  var execCommand = function(err) {
    if (err) return onerror(err)
    cmdModule(dat, argv, function(err) {
      if (err) {
        if (cmd === 'init') {
          console.error(err.message)
          exit(0)
        }
        return onerror(err)
      }
      setImmediate(close)
    })
  }

  if (!dat.db && !noDat) return onerror(new Error('There is no dat here'))
  if (first !== 'listen' && !dat.rpcClient) {
    var server = datServer(dat)
    return server.listen(argv.port, argv, execCommand)
  }
  execCommand()
})


function toFolder(dir) {
  if (!dir) return dir
  return dir.replace(/^.*\/\//, '').replace(/[\/:].*$/, '')
}

function close() {
  // if _server exists it means dat is the rpc server
  if (dat._server) {
    // since the server process can't exit yet we must manually close stdout
    stdout.end()

    // if there aren't any active connections then we can close the server
    if (dat._connections.sockets.length === 0) dat.close()

    // otherwise wait for the current connections to close
    dat._connections.on('idle', function() {
      debug('dat close due to idle')
      dat.close()
    })

  } else {
    dat.close()
  }
}