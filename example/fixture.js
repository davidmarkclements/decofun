function one (a, cb) {

}


one('blah', function () {

})

function two () {
  return function () { }
}


function three () {
  return {
    shoe: function () {}
  }
}

function four () {
  return function () { 
    return function () {

    }
  }
}

function five () {
  return function () {
    return function () {
      return function () {
        foo('blue', function () {

        })
      }
    }
  }
}


var six = function () {

}


var seven = function (err, cb) {

  return function () {
    cb(function () {

    })
  }

}

var o = {};
o.eight = function (cb) { }


o.eight(function () { })

o.eight.nine = function () {}
o.eight.nine(function () { })

var o2;

o2 = function () { }


;(function () {}())

!function () { }()




