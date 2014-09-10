var decofun = require('../')
var fs = require('fs');
var path = require('path')
var fixture = fs.readFileSync(path.join(__dirname, './fixture.js'));

console.log(decofun(fixture))


