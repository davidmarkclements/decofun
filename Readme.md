# TOC
   - [functions assigned to variables](#functions-assigned-to-variables)
   - [function parameters](#function-parameters)
   - [method parameters](#method-parameters)
   - [returned functions](#returned-functions)
   - [returned functions of returned anonymous functions](#returned-functions-of-returned-anonymous-functions)
   - [methods declared in object literals](#methods-declared-in-object-literals)
   - [methods assigned to instantiated objects](#methods-assigned-to-instantiated-objects)
<a name=""></a>
 
<a name="functions-assigned-to-variables"></a>
# functions assigned to variables
are named "of var <varname> | line N".

```js
var input = 'var myFn = function () {}'
var expected = 'var myFn = function as'+_+'var'+_+'myFn'+_+'ㅣline'+_+'1 () {}'
decofun(input).should.equal(expected)
```

<a name="function-parameters"></a>
# function parameters
are named "passed into <called function> | line N".

```js
var input = 'someFunc(\'blah\', function () {})'
var expected = 'someFunc(\'blah\', function passed'+_+'into'+_+'someFunc'+_+'ㅣline'+_+'1 () {})'

decofun(input).should.equal(expected)
```

<a name="method-parameters"></a>
# method parameters
are named "passed into <parent object>ː<property name> | line N".

```js
var input = 'obj.prop(function () { })'
var name = 'passed into objːprop ㅣline 1'.replace(/ /g, _);
var expected = 'obj.prop(function '+name+' () { })'
decofun(input).should.equal(expected)
```

<a name="returned-functions"></a>
# returned functions
are named "returned from <parent function> | line N".

```js
var input = 'function f() {return function () { }}'
var name = 'returned from f ㅣline 1'.replace(/ /g, _);
var expected = 'function f() {return function '+name+' () { }}'
decofun(input).should.equal(expected)
```

<a name="returned-functions-of-returned-anonymous-functions"></a>
# returned functions of returned anonymous functions
are named "returned from ᐸ <parent function (named)> ᐳ | line N".

```js
var input = function contain () {
  return function () { 
    return function () {
    }
  }
}.toString();
var firstName = 'returned from contain ㅣline 2'.replace(/ /g, _);
var secondName = 'returned from ᐸ returned from contain ᐳ ㅣline 3'.replace(/ /g, _);
var expected = ['function contain() {',
'    return function ' + firstName + ' () { ',
'      return function ' + secondName + ' () {',
'',
'      }',
'    }',
'  }'].join('\n')


decofun(input).should.equal(expected)
```

<a name="methods-declared-in-object-literals"></a>
# methods declared in object literals
are named "as property <property name> ㅣ line N".

```js
var input = function contain () {
   return {
     propInLiteral: function () {}
   }
 }.toString()
 var name = 'as property propInLiteral ㅣline 3'.replace(/ /g, _)
 var expected = ['function contain() {',
 '    return {',
 '      propInLiteral: function ' + name + ' () {}',
 '    }',
 '  }'].join('\n')
 decofun(input).should.equal(expected)
```

<a name="methods-assigned-to-instantiated-objects"></a>
# methods assigned to instantiated objects
are named "as property <property name> ㅣ line N".

```js
var input = 'var o = {}; o.p = function (cb) { }'
var name = 'as property p ㅣline 1'.replace(/ /g, _)
var expected = 'var o = {}; o.p = function ' + name + ' (cb) { }'
decofun(input).should.equal(expected)
```

