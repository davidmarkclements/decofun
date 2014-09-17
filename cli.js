#!/usr/bin/env node

var parseArgs = require('minimist');
var path = require('path');
var fs = require('fs');

var decofun = require('./index.js');
var argv = parseArgs(process.argv.slice(2));
var input, output;

if(!argv._.length) {
  console.error('decofun needs a file to read.. pass it as the first arg');
  return process.exit();
}

//input is assummed to be the first argument
input = fs.readFileSync(path.join(__dirname, argv._[0]));
//output can be specified by -o or parsed as the last argument
if(argv.o) {
  output = fs.createWriteStream(path.join(__dirname, argv.o));
} else if(argv._.length > 1) {
  output = fs.createWriteStream(path.join(__dirname, argv._[argv._.length-1]));
} else {
  output = process.stdout;
}

output.write(decofun(input));