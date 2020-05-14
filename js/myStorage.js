;(function () {
  var localStorage = window.localStorage
  window.ms = {
    set: set,
    get: get
  }
  function set (key, val) {
    console.log(val, JSON.stringify(val))
    localStorage.setItem(key, JSON.stringify(val))
  }
  function get (key) {
    var json = localStorage.getItem(key)
    if (json) {
      console.log(key, json, JSON.parse(json))
      return JSON.parse(json)
    }
  }
})()
window.ms.set('name', '王花花')
var name = window.ms.get('name')
console.log(name)
