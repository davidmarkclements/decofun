module.exports.test = function () {
   return function () {
       return {
         prop: function () {
           setTimeout(function () {
             console.trace('Getting a trace...');  
           }, 10)
           
         }
       }
   }
}