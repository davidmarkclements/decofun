var falafel = require('falafel');
var fs = require('fs');
var semantics = require('./semantics.json')
var space = '\uffa0';

module.exports = decofun;
decofun.auto =  require('./lib/auto')(decofun);
decofun.restore = require('./lib/auto').restore;

Object.keys(semantics).forEach(function (k) {
   semantics[k] = semantics[k].replace(/ /g, space);
})

function nameFunc(fnstr, name) {
  return fnstr.replace(/function/, 'function ' + name);
}

var again;
var output;

rewrite.count = 0;
rewrite.max = 44;
function rewrite (src) {
  if (rewrite.count > rewrite.max) {
    again = false;
    rewrite.count = 0;
    return;
  }
  output = falafel(src, {loc: true}, function (node) {
    try {
      if (node.type !== 'FunctionExpression' || node.id) {
        return;
      }

      var name = '';
      var pType = node.parent.type;
      if (pType === 'CallExpression') {

        if (node.parent.callee.name) {
          name = semantics.argTo + node.parent.callee.name; 
        } else {

          if (!node.parent.callee.object) {
            name = 'IIFE';

          } else {
            if (node.parent.callee.object.type === 'Identifier') {
              name = semantics.argTo + node.parent.callee.object.name + 'ː' + node.parent.callee.property.name;
            } 

            if (node.parent.callee.object.type === 'MemberExpression') {
              name = semantics.argTo + node.parent.callee.object.property.name + 'ː' + node.parent.callee.property.name;
            }

          }


        }
        
      }

      if (pType === 'ReturnStatement') {
        if (!node.parent.parent.parent.id) { 
          again = true; 
          rewrite.count += 1;
          return; 
        }

        

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
        if (node.parent.left.property) {
          name = semantics.onProperty + node.parent.left.property.name;  
        } else {
          name = semantics.ofVar + node.parent.left.name;  
        }
        
      }

      if (pType === 'VariableDeclarator') {
        name = semantics.ofVar + node.parent.id.name; 
      }

      name += 'ﾠㅣline' + space + node.loc.start.line;

      node.update(nameFunc(node.source(), name))

    } catch (e) {
      //if failure should occur, just don't update the node.
    }
  })

  if (again) { again = false; rewrite(output+''); }

}

function decofun(src) {
  if ((src instanceof Buffer) || typeof src === 'string') {
    return decofun.transform(src);  
  }
  return module.exports.auto.apply(this, arguments);
}


decofun.transform = function (src) {
  rewrite.count = 0;
  rewrite(src+'');
  return output+'';
}



