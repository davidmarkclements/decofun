var falafel = require('falafel');
var fs = require('fs');
var semantics = require('./semantics.json')
var space = '\uffa0';

Object.keys(semantics).forEach(function (k) {
   semantics[k] = semantics[k].replace(/ /g, space);
})

function nameFunc(fnstr, name) {
  return fnstr.replace(/function/, 'function ' + name);
}

var again;
var output;

function rewrite (src) {
  output = falafel(src, {loc: true}, function (node) {

    if (node.type !== 'FunctionExpression' || node.id) {
      return;
    }

    var name = '';
    var pType = node.parent.type;
    if (pType === 'CallExpression') {

      if (node.parent.callee.name) {
        name = semantics.argTo + node.parent.callee.name; 
      } else {
        if (node.parent.callee.object.type === 'Identifier') {
          name = semantics.argTo + node.parent.callee.object.name + 'ː' + node.parent.callee.property.name;
        } 

        if (node.parent.callee.object.type === 'MemberExpression') {
          name = semantics.argTo + node.parent.callee.object.property.name + 'ː' + node.parent.callee.property.name;
        }
      }
      
    }

    if (pType === 'ReturnStatement') {
      if (!node.parent.parent.parent.id) { again = true; return; }

      

      if (Object.keys(semantics).map(function (k) {
        return node.parent.parent.parent.id.name.match(semantics[k]);
      }).filter(Boolean).length) {

        name = semantics.returnedFrom + 'ᐸ' + space + node.parent.parent.parent.id.name.split('ﾠㅣ')[0] + space + 'ᐳ'

      } else {
        name = semantics.returnedFrom + node.parent.parent.parent.id.name;  
      }
      
    }

    if (pType === 'Property') {
      name = semantics.onProperty + node.parent.key.name;
    }

    if (pType === 'AssignmentExpression') {
      name = semantics.onProperty + node.parent.left.property.name;
    }

    if (pType === 'VariableDeclarator') {
      name = semantics.ofVar + node.parent.id.name; 
    }

    name += 'ﾠㅣline' + space + node.loc.start.line;

    node.update(nameFunc(node.source(), name))

  })

  if (again) { again = false; rewrite(output+''); }

}


module.exports = function (src) {
  rewrite(src+'');
  return output+'';
}