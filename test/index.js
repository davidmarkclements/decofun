var decofun = require('../')
var should = require('chai').should();
var _ = '\uffa0'; //space

suite('functions assigned to variables')

test('are named "of var <varname> | line N"', function () {
	var input = 'var myFn = function () {}'
	var expected = 'var myFn = function as'+_+'var'+_+'myFn'+_+'ㅣline'+_+'1 () {}'

	decofun(input).should.equal(expected)

})


suite('function parameters')

test('are named "passed into <called function> | line N"', function () {
	var input = 'someFunc(\'blah\', function () {})'
	var expected = 'someFunc(\'blah\', function passed'+_+'into'+_+'someFunc'+_+'ㅣline'+_+'1 () {})'
	
	decofun(input).should.equal(expected)

})


suite('method parameters')

test('are named "passed into <parent object>ː<property name> | line N"', function () {
  var input = 'obj.prop(function () { })'
  var name = 'passed into objːprop ㅣline 1'.replace(/ /g, _);
  var expected = 'obj.prop(function '+name+' () { })'

  decofun(input).should.equal(expected)

})


suite('returned functions')

test('are named "returned from <parent function> | line N"', function () {
  var input = 'function f() {return function () { }}'
  var name = 'returned from f ㅣline 1'.replace(/ /g, _);
  var expected = 'function f() {return function '+name+' () { }}'

  decofun(input).should.equal(expected)

})



suite('returned functions of returned anonymous functions')

test('are named "returned from ᐸ <parent function (named)> ᐳ | line N"', function () {
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

test('are named "as property <property name> ㅣ line N"', function () { 
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

test('are named "as property <property name> ㅣ line N"', function () {
  var input = 'var o = {}; o.p = function (cb) { }'
  var name = 'as property p ㅣline 1'.replace(/ /g, _)
  var expected = 'var o = {}; o.p = function ' + name + ' (cb) { }'

  decofun(input).should.equal(expected)

})
