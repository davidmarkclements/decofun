#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))
var path = require('path');

if (!argv._.length) {
  //tell parent process to simply spawn a REPL
  process.exit(209);
  return;
}

require('./')();
require(path.join(process.cwd(), argv._[0]));