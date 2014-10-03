var decofun = require('../')
var should = require('chai').should();
var _ = '\uffa0'; //space


//transformations:

suite('functions assigned to declared variables')

test('are labelled "of var <varname> | line N"', function () {
	var input = 'var myFn = function () {}'
	var expected = 'var myFn = function as'+_+'var'+_+'myFn'+_+'ㅣline'+_+'1 () {}'

	decofun(input).should.equal(expected)

})

suite('functions assigned to variables after declaration')

test('are labelled "of var <varname> | line N"', function () {
  var input = 'var myFn; myFn = function () {}'
  var expected = 'var myFn; myFn = function as'+_+'var'+_+'myFn'+_+'ㅣline'+_+'1 () {}'

  decofun(input).should.equal(expected)

})


suite('function parameters')

test('are labelled "passed into <called function> | line N"', function () {
	var input = 'someFunc(\'blah\', function () {})'
	var expected = 'someFunc(\'blah\', function passed'+_+'into'+_+'someFunc'+_+'ㅣline'+_+'1 () {})'
	
	decofun(input).should.equal(expected)

})


suite('method parameters')

test('are labelled "passed into <parent object>ː<property name> | line N"', function () {
  var input = 'obj.prop(function () { })'
  var name = 'passed into objːprop ㅣline 1'.replace(/ /g, _);
  var expected = 'obj.prop(function '+name+' () { })'

  decofun(input).should.equal(expected)

})

suite('sub-object method parameters')

test('are labelled "passed into <parent subobject>ː<property name> | line N"', function () {
  var input = 'obj.subobj.prop(function () { })'
  var name = 'passed into subobjːprop ㅣline 1'.replace(/ /g, _);
  var expected = 'obj.subobj.prop(function '+name+' () { })'

  decofun(input).should.equal(expected)

})


suite('returned functions')

test('are labelled "returned from <parent function> | line N"', function () {
  var input = 'function f() {return function () { }}'
  var name = 'returned from f ㅣline 1'.replace(/ /g, _);
  var expected = 'function f() {return function '+name+' () { }}'

  decofun(input).should.equal(expected)

})



suite('returned functions of returned anonymous functions')

test('are labelled "returned from ᐸ <parent function (named)> ᐳ | line N"', function () {
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



})


suite('methods declared in object literals')

test('are labelled "as property <property name> ㅣ line N"', function () { 
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

})


suite('methods assigned to instantiated objects')

test('are labelled "as property <property name> ㅣ line N"', function () {
  var input = 'var o = {}; o.p = function (cb) { }'
  var name = 'as property p ㅣline 1'.replace(/ /g, _)
  var expected = 'var o = {}; o.p = function ' + name + ' (cb) { }'

  decofun(input).should.equal(expected)

})


suite('immediately invoked function expressions')

test('are labelled "IIFEㅣ line N"', function () {
  var input = '!function() {}()'
  var expected = '!function IIFE'+_+'ㅣline'+_+'1() {}()';
  decofun(input).should.equal(expected)

  input = '(function(){}());'
  expected = '(function IIFE'+_+'ㅣline'+_+'1(){}());'

  decofun(input).should.equal(expected)  

})

//API:

suite('decofun.auto')

test('will transform modules loaded with require', function () {
  var transformed = require('./fixtures/transformed').test+''
  decofun.auto();
  var original = require('./fixtures/original').test+'';
  original.should.equal(transformed)

  decofun.restore();
})

suite('decofun.transform')

test('performs the same as decofun(src)', function () {
  var input = 'var myFn = function () {}'
  var expected = 'var myFn = function as'+_+'var'+_+'myFn'+_+'ㅣline'+_+'1 () {}'

  decofun.transform(input).should.equal(expected)
})


suite('decofun implicit auto via polymorphism')

test('calls the auto method when no source string is passed', function () {
  var transformed = require('./fixtures/transformed').test+''
  decofun();
  var original = require('./fixtures/original').test+'';
  original.should.equal(transformed)

  decofun.restore();
})

suite('decofun.restore')

test('will restore the require to pre-auto state', function () {
  decofun.auto();
  var original = require('./fixtures/original').test+'';
  
  var transformed = require('./fixtures/transformed').test+''
  original.should.equal(transformed)

  decofun.restore();
  genuineOriginal = require('./fixtures/original').test+'';

  genuineOriginal.should.not.equal(transformed)
})


//features

suite('recursion safety')

test('supports a maximum depth of returned functions', function () {
  var input = 'function toodeep () {\n  return function () {\n    return function () {\n      return function () {\n        \n        return function () {\n          return function () {\n            return function () {\n            \n              return function () {\n                return function () {\n                  return function () {\n\n                    return function () {\n                     \n                    }                     \n                    \n                  }\n                }\n              } \n\n            }\n          }\n        }        \n      }\n    }\n  }\n}';
  var expected = 'function toodeep () {\n  return function returnedﾠfromﾠtoodeepﾠㅣlineﾠ2 () {\n    return function returnedﾠfromﾠᐸﾠreturnedﾠfromﾠtoodeepﾠᐳﾠㅣlineﾠ3 () {\n      return function returnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠtoodeepﾠᐳﾠᐳﾠㅣlineﾠ4 () {\n        \n        return function returnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠtoodeepﾠᐳﾠᐳﾠᐳﾠㅣlineﾠ6 () {\n          return function returnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠtoodeepﾠᐳﾠᐳﾠᐳﾠᐳﾠㅣlineﾠ7 () {\n            return function returnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠtoodeepﾠᐳﾠᐳﾠᐳﾠᐳﾠᐳﾠㅣlineﾠ8 () {\n            \n              return function returnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠtoodeepﾠᐳﾠᐳﾠᐳﾠᐳﾠᐳﾠᐳﾠㅣlineﾠ10 () {\n                return function returnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠtoodeepﾠᐳﾠᐳﾠᐳﾠᐳﾠᐳﾠᐳﾠᐳﾠㅣlineﾠ11 () {\n                  return function returnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠᐸﾠreturnedﾠfromﾠtoodeepﾠᐳﾠᐳﾠᐳﾠᐳﾠᐳﾠᐳﾠᐳﾠᐳﾠㅣlineﾠ12 () {\n\n                    return function () {\n                     \n                    }                     \n                    \n                  }\n                }\n              } \n\n            }\n          }\n        }        \n      }\n    }\n  }\n}';

  decofun(input).should.equal.expected;
})







