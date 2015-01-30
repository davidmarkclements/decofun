# Decofun – Debug tool

Decofun is a JavaScript function deanonymizer.

It parses your code and names any anonymous
functions according to their context.

[![Build Status](https://travis-ci.org/davidmarkclements/decofun.svg?branch=master)](https://travis-ci.org/davidmarkclements/decofun)

[![Coverage Status](https://img.shields.io/coveralls/davidmarkclements/decofun.svg?bust)](https://coveralls.io/r/davidmarkclements/decofun?branch=master)

Version 1.2.x

 - [install](#install)
 - [features](#features)
 - [tests](#tests)
 - [examples](#examples)

<a name="install"></a>
## Install

```sh
npm i decofun
```

<a name="features"></a>
# Features

## Command Line Tool
```
sudo npm -g i decofun
```
New in version 1.2.x we can simply use the `deco` 
executable in place of `node` to instrument 
anonymous functions.

```sh
deco examples/loadable
```

The `deco` executable can also be instructed to 
use the [cute-stack](https://github.com/davidmarkclements/cute-stack) module to prettify stack
traces, just add a `--cute` flag

```sh
deco examples/loadable --cute
```

To set the `cute-stack`'s display type, 
pass it as the value of `--cute`
 
```sh
deco examples/loadable --cute table
```

To set the stack size pass a number

```sh
deco examples/loadable --cute 20
```

To set both the display type and number, 
pass a JSON array

```sh
deco examples/loadable --cute '["table", 20]'
```


## Automatic Instrumentation
New in version 1.1.x, we can use decofun to automatically
instrument any required modules, simply call the `auto` method, 
before requring any other modules

```javascript
require('decofun').auto()
var myMod = require('./lib/myModule.js')
var somePub = require('somePublishedMod')
```

Both myMod and somePub will now have their anonymous functions named.

Alternatively, decofun can be called directly as a
function (without supplying a path argument) to
achieve the same result:

```javascript
require('decofun')() # same as require('decofun').auto()
var myMod = require('./lib/myModule.js')
var somePub = require('somePublishedMod')
```

To undo automatic instrumentation and restore former
behavior, simply use the `restore` method:

```javascript
var decofun = require('decofun');
decofun.auto();
var myMod = require('./aModToDebug')
decofun.restore();
var anotherMod = require('./noDebugNeededThx')
```

## Client-side Instrumenting

For instrumenting browser code, you can use
the [deco-server](https://npmjs.org/package/deco-server) module.

There is a live `deco-server` running on heroku, for instance
we can deanonymize jQuery by with the following URL:

[http://decofun.herokuapp.com/?addr=http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.js](http://decofun.herokuapp.com/?addr=http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.js)

A deco transform is also planned for those who 
use browserify - for now we can simply
use a `deco-server` to host our browserified code.

## Programmatic Transform

We can transform any string containing JavaScript with
the `transform` method. 

```javascript
var decofun = require('decofun')
var fs = require('fs');
var path = require('path')
var fixture = fs.readFileSync(path.join(__dirname, './fixture.js'));

console.log(decofun.transform(fixture))
```

As with the `auto` method, transforms can also be achieved
with the polymorphic function representing the decofun module.
When we pass a string to the decofun function, it executes a
transform (and when we don't pass a string it calls `decofun.auto`):

```javascript
console.log(decofun(fixture))

//same thing:
//console.log(decofun.transform(fixture))

```


<a name="tests"></a>
## Tests

Run tests with

```
npm test
```


<a name="example"></a>
## Examples

The examples folder is a good place to start. 

To see how a direct transform would work, 
from the install directory we could run these commands:

```sh
cat node_modules/decofun/examples/transform/fixture.js #view the original
node node_modules/decofun/examples/transform # view the result
```

To see instrumentation upon `require` (the Auto feature), 
run the following:

```sh
cat node_modules/decofun/examples/auto/fixture.js #view the original
node node_modules/decofun/examples/auto # view the result
```



<a name="functions-assigned-to-variables"></a>
### functions assigned to variables
Are labelled "of var <varname> | line N".

```javascript
var myFn = function () {}
```

Transforms into:
```javascript
var myFn = function asﾠvarﾠmyFnﾠㅣlineﾠ1 () {}
```

<a name="function-parameters"></a>
### function parameters
Are labelled "passed into <called function> | line N".

```javascript
someFunc('blah', function () {})

```

Transforms into:
```javascript
someFunc('blah', function passedﾠintoﾠsomeFuncﾠㅣlineﾠ1 () {})
```

<a name="method-parameters"></a>
### method parameters
Are labelled "passed into <parent object>ː<property name> | line N".

```javascript
obj.prop(function () { })
```

Transforms into:
```javascript
obj.prop(function passedﾠintoﾠobjːpropﾠㅣlineﾠ1 () { })
```

<a name="sub-object-method-parameters"></a>
### sub-object method parameters
Are labelled "passed into <parent subobject>ː<property name> | line N".

```javascript
obj.subobj.prop(function () { })
```

Transforms into:
```javascript
obj.subobj.prop(function passedﾠintoﾠsubobjːpropﾠㅣlineﾠ1 () { })
```

<a name="returned-functions"></a>
### returned functions
Are labelled "returned from <parent function> | line N".

```javascript
function f() {return function () { }}
```

Transforms into:
```javascript
function f() {return function returnedﾠfromﾠfﾠㅣlineﾠ1 () { }}
```

<a name="returned-functions-of-returned-anonymous-functions"></a>
### returned functions of returned anonymous functions
Are labelled "returned from ᐸ <parent function (named)> ᐳ | line N".

```javascript
function contain () {
  return function () { 
    return function () {
    }
  }
}
```

Transforms into:
```javascript
function contain() {
  return function returnedﾠfromﾠcontainﾠㅣlineﾠ2 () {
    return function returnedﾠfromﾠᐸﾠreturnedﾠfromﾠcontainﾠᐳﾠㅣlineﾠ3 () {

    }
  }
}

```

<a name="methods-declared-in-object-literals"></a>
### methods declared in object literals
Are labelled "as property <property name> ㅣ line N".

```javascript
function contain () {
   return {
     propInLiteral: function () {}
   }
}
```

Transforms into:
```javascript
function contain() {
    return {
      propInLiteral: function asﾠpropertyﾠpropInLiteralﾠㅣlineﾠ3 () {}
    }
}
```

<a name="methods-assigned-to-instantiated-objects"></a>
### methods assigned to instantiated objects
Are labelled "as property <property name> ㅣ line N".

```javascript
var o = {}; o.p = function (cb) { }
```

Transforms into:
```javascript
var o = {}; o.p = function asﾠpropertyﾠpﾠㅣlineﾠ1 (cb) { }
```

<a name="immediately-invoked-function-expressions"></a>
### immediately invoked function expressions
Are labelled "IIFEㅣ line N".

```javascript
!function() {}()
;(function(){}())
```

Transforms into:

```javascript
!function IIFEﾠㅣlineﾠ1() {}()
;(function IIFEﾠㅣlineﾠ2(){}())
```

# Kudos

Sponsered by [nearForm](http://nearform.com)


