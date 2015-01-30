function gravy () {
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

console.log(gravy+'');
gravy()().prop();