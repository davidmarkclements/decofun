# Decofun – Debug tool
## Name anonymous functions

[![Build Status](https://travis-ci.org/davidmarkclements/decofun.svg?branch=master)](https://travis-ci.org/davidmarkclements/decofun)

[![Coverage Status](https://img.shields.io/coveralls/davidmarkclements/decofun.svg?bust)](https://coveralls.io/r/davidmarkclements/decofun?branch=master)

# TOC
   - [functions assigned to variables](#functions-assigned-to-variables)
   - [function parameters](#function-parameters)
   - [method parameters](#method-parameters)
   - [returned functions](#returned-functions)
   - [returned functions of returned anonymous functions](#returned-functions-of-returned-anonymous-functions)
   - [methods declared in object literals](#methods-declared-in-object-literals)
   - [methods assigned to instantiated objects](#methods-assigned-to-instantiated-objects)

 
<a name="functions-assigned-to-variables"></a>
# functions assigned to variables
Are named "of var <varname> | line N".

```js
var myFn = function () {}
```

Transforms into:
```js
var myFn = function asﾠvarﾠmyFnﾠㅣlineﾠ1 () {}
```

<a name="function-parameters"></a>
# function parameters
Are named "passed into <called function> | line N".

```js
someFunc('blah', function () {})

```

Transforms into:
```js
someFunc('blah', function passedﾠintoﾠsomeFuncﾠㅣlineﾠ1 () {})
```

<a name="method-parameters"></a>
# method parameters
Are named "passed into <parent object>ː<property name> | line N".

```js
obj.prop(function () { })
```

Transforms into:
```js
obj.prop(function passedﾠintoﾠobjːpropﾠㅣlineﾠ1 () { })
```

<a name="returned-functions"></a>
# returned functions
Are named "returned from <parent function> | line N".

```js
function f() {return function () { }}
```

Transforms into:
```js
function f() {return function returnedﾠfromﾠfﾠㅣlineﾠ1 () { }}
```

<a name="returned-functions-of-returned-anonymous-functions"></a>
# returned functions of returned anonymous functions
Are named "returned from ᐸ <parent function (named)> ᐳ | line N".

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
# methods declared in object literals
Are named "as property <property name> ㅣ line N".

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
# methods assigned to instantiated objects
Are named "as property <property name> ㅣ line N".

```js
var o = {}; o.p = function (cb) { }
```

Transforms into:
```js
var o = {}; o.p = function asﾠpropertyﾠpﾠㅣlineﾠ1 (cb) { }
```

