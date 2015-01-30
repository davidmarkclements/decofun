#!/usr/bin/env node

/**
 * This tiny wrapper file checks for known node flags 
 * and appends them when found, before invoking the "real" _cmd
 * executable. Inspired by similar mocha -> _mocha interactions
 */

var spawn = require('child_process').spawn
  , args = [ __dirname + '/_cmd' ];

process.argv.slice(2).forEach(function(arg){
  var flag = arg.split('=')[0];

  switch (flag) {
    case '-d':
      args.unshift('--debug');
      args.push('--no-timeouts');
      break;
    case 'debug':
    case '--debug':
    case '--debug-brk':
      args.unshift(arg);
      args.push('--no-timeouts');
      break;
    case '-gc':
    case '--expose-gc':
      args.unshift('--expose-gc');
      break;
    case '--gc-global':
    case '--harmony':
    case '--harmony-proxies':
    case '--harmony-collections':
    case '--harmony-generators':
    case '--no-deprecation':
    case '--prof':
    case '--basic-perf-prof':
    case '--throw-deprecation':
    case '--trace-deprecation':
      args.unshift(arg);
      break;
    default:
      if (0 == arg.indexOf('--trace')) args.unshift(arg);
      else args.push(arg);
      break;
  }
});
var proc = spawn(process.argv[0], args, { stdio: 'inherit' });
proc.on('exit', function onExit(code, signal) {
  if (+code === 209) {
    proc = spawn('node', args.slice(1), { stdio: 'inherit' });
    proc.on('exit', onExit);
  }
  process.on('exit', function(){
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code);
    }
  });
});

// terminate children.
process.on('SIGINT', function () {
  proc.kill('SIGINT'); // calls runner.abort()
  proc.kill('SIGTERM'); // if that didn't work, we're probably in an infinite loop, so make it die.
  process.kill(process.pid, 'SIGINT');
});