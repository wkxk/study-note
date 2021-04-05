/*
  将下面异步代码使用 Promise 的方法改进
  尽量用看上去像同步代码的方式
  setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
      var b = 'lagou'
      setTimeout(function () {
        var c = 'I ♥ U'
        console.log(a + b +c)
      }, 10)
    }, 10)
  }, 10)
*/
Promise.resolve(() => 'hello')
  .then(a => a()).then(b => b + 'lagou')
  .then(c => c + 'I ♥ U')
  .then(res => console.log(res))

