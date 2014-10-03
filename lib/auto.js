var originalCompile = module.__proto__._compile;

module.exports = function (decofun) { 
  return function () {
    module.__proto__._compile = (function (compile) {
      return function (content, filename) {
        this.deanonymized = true;
        compile.call(this, decofun(content), filename);
      }
    }(module._compile));
  }
}

module.exports.restore = function () {
  Object.keys(require.cache).filter(function(k) {
    var mod = require.cache[k];
    return mod.deanonymized
  }).forEach(function (k) { 
    delete require.cache[k];
  })

  module.__proto__._compile = originalCompile;
}