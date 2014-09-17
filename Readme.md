# Decofun – Debug tool
## Name anonymous functions

[![Build Status](https://travis-ci.org/davidmarkclements/decofun.svg?branch=master)](https://travis-ci.org/davidmarkclements/decofun)

[![Coverage Status](https://img.shields.io/coveralls/davidmarkclements/decofun.svg?bust)](https://coveralls.io/r/davidmarkclements/decofun?branch=master)

# TOC
   - [install](#install)
   - [usage](#usage)
   - [example](#example)
   - [tests](#tests)
   - [transformations](#transformations)
     - [functions assigned to variables](#functions-assigned-to-variables)
     - [function parameters](#function-parameters)
     - [method parameters](#method-parameters)
     - [sub-object method parameters](#sub-object-method-parameters)
     - [returned functions](#returned-functions)
     - [returned functions of returned anonymous functions](#returned-functions-of-returned-anonymous-functions)
     - [methods declared in object literals](#methods-declared-in-object-literals)
     - [methods assigned to instantiated objects](#methods-assigned-to-instantiated-objects)
     - [immediately invoked function expressions](#immediately-invoked-function-expressions)
<a name=""></a>


<a name="install"></a>

```sh
npm i decofun -g
```

<a name="usage"></a>

decofun has a simple cli interface, which takes as it's first argument a file to transform; it's up to up how you want to handle the output.

### redirect the output:

```sh
decofun path/to/file.js > output.js
```

... this can also be done like so:

```sh
decofun path/to/file.js output.js
```

### pipe the output:

```sh
decofun path/to/file.js | less
```

### if in doubt, stdout

```sh
decofun path/to/file.js
```


<a name="example"></a>
# Example

The easiest way to grok this, is to check the example

```sh
cat ./example/fixture.js #view the original
decofun ./example/fixture.js # view the transform result
```
<a name="tests"></a>

Run tests with

```
npm test
```
<a name="transformations"></a>
# Transformations

<a name="functions-assigned-to-variables"></a>
## functions assigned to variables
Are labelled "of var <varname> | line N".

```js
var myFn = function () {}
```

Transforms into:
```js
var myFn = function asﾠvarﾠmyFnﾠㅣlineﾠ1 () {}
```

<a name="function-parameters"></a>
## function parameters
Are labelled "passed into <called function> | line N".

```js
someFunc('blah', function () {})

```

Transforms into:
```js
someFunc('blah', function passedﾠintoﾠsomeFuncﾠㅣlineﾠ1 () {})
```

<a name="method-parameters"></a>
## method parameters
Are labelled "passed into <parent object>ː<property name> | line N".

```js
obj.prop(function () { })
```

Transforms into:
```js
obj.prop(function passedﾠintoﾠobjːpropﾠㅣlineﾠ1 () { })
```

<a name="sub-object-method-parameters"></a>
## sub-object method parameters
Are labelled "passed into <parent subobject>ː<property name> | line N".

```js
obj.subobj.prop(function () { })
```

Transforms into:
```js
obj.subobj.prop(function passedﾠintoﾠsubobjːpropﾠㅣlineﾠ1 () { })
```

<a name="returned-functions"></a>
## returned functions
Are labelled "returned from <parent function> | line N".

```js
function f() {return function () { }}
```

Transforms into:
```js
function f() {return function returnedﾠfromﾠfﾠㅣlineﾠ1 () { }}
```

<a name="returned-functions-of-returned-anonymous-functions"></a>
## returned functions of returned anonymous functions
Are labelled "returned from ᐸ <parent function (named)> ᐳ | line N".

```js
function contain () {
  return function () { 
    return function () {
    }
  }
}
```

Transforms into:
```js
function contain() {
  return function returnedﾠfromﾠcontainﾠㅣlineﾠ2 () {
    return function returnedﾠfromﾠᐸﾠreturnedﾠfromﾠcontainﾠᐳﾠㅣlineﾠ3 () {

    }
  }
}

```

<a name="methods-declared-in-object-literals"></a>
## methods declared in object literals
Are labelled "as property <property name> ㅣ line N".

```js
function contain () {
   return {
     propInLiteral: function () {}
   }
}
```

Transforms into:
```js
function contain() {
    return {
      propInLiteral: function asﾠpropertyﾠpropInLiteralﾠㅣlineﾠ3 () {}
    }
}
```

<a name="methods-assigned-to-instantiated-objects"></a>
## methods assigned to instantiated objects
Are labelled "as property <property name> ㅣ line N".

```js
var o = {}; o.p = function (cb) { }
```

Transforms into:
```js
var o = {}; o.p = function asﾠpropertyﾠpﾠㅣlineﾠ1 (cb) { }
```

<a name="immediately-invoked-function-expressions"></a>
## immediately invoked function expressions
Are labelled "IIFEㅣ line N".

```js
!function() {}()
;(function(){}())
```

Transforms into:
```js
!function IIFEﾠㅣlineﾠ1() {}()
;(function IIFEﾠㅣlineﾠ2(){}())
```




