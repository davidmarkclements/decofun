#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))
var path = require('path');
var cute = require('cute-stack');

if (!argv._.length) {
  //tell parent process to simply spawn a REPL
  process.exit(209);
  return;
}

function parse() {
  try {
    argv.cute = JSON.parse(argv.cute)
  } catch(e) {
    console.log('shit', e);
  }
}

if (argv.cute) {
  parse();
  console.log(argv.cute)
  if (Array.isArray(argv.cute)) {
    console.log('passing', argv.cute)
    cute.apply(cute, argv.cute);
  } else {
    cute(argv.cute !== true && argv.cute);  
  }
}

require('./')();
require(path.join(process.cwd(), argv._[0]));