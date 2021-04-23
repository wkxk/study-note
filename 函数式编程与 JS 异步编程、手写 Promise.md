# Part1 函数式编程

概念：（Functional Programming 简称FP） 一种编程思想，对运算过程的一种抽象。

将程序的过程抽象成函数（数学上的函数，是某种关系的映射）。

## 1.高阶函数

> 函数是一等公民：函数作为参数，函数作为返回值，函数可以被一个变量存储。
>
> 常用的高阶函数：forEach, map,every,some...

### 1.1 函数作为参数

```js
// 分装一个forEach,接收两个参数，数组，函数
function forEach (array, fn) {
  for (let key of array) {
    if (key) fn(key)
  }
}
forEach([1, 2, 3], i => {
  console.log(i)
})
```

### 1.2 函数作为返回值

> 意义：可以将函数的过程抽象化，我们只需知道我们想要的结果和实现的方法。将过程抽象化。
>

```js
// 封装once接收一个函数作为入参，返回一个函数
function once (fn) {
  let done = false
  return function () {
    if (!done) {
      done = true
      return fn.apply(this, arguments)
    }
  }
}
let pay = once(function (money) {
  console.log(`支付: ${money} RMB`)
})

pay(5) // 只会执行一次
pay(5)
pay(5)
pay(5)
```

## 2.纯函数

> 概念：一种固定的输入总会得到固定的结果。
>

> Slice: 不会改变原数组 （纯函数）。
>
> splice：会改变原数组（不纯的函数）。

```js
const arr = [1, 2, 3, 4, 5]
console.log(arr.slice(0, 1)) // [1] 纯函数
console.log(arr.slice(0, 1)) // [1]
console.log(arr.slice(0, 1)) // [1]

console.log(arr.splice(0, 3)) // [1, 2, 3] 不纯的函数
console.log(arr.splice(0, 3)) // [4, 5]
console.log(arr.splice(0, 3))	// []
```

## 3.lodash 工具库

```js
// flowRight函数组合，curry柯里化
const { flowRight, curry } = require('lodash')
// fp模块
const fp = require('lodash/fp')
```

## 4.闭包

> 概念：在一个函数内部的一个函数，内部函数可以访问到外部函数作用域内的成员变量。
>

> 优点：可以延长函数内部成员的生命周期。
>
> 缺点：会造成内存泄露。

```js
// 缓存函数
function memoize (fn) {
  // 创建一个缓存区域
  let cache = {}
  return function () {
    // 入参转化成字符串
    let key = JSON.stringify(arguments)
    // 存在直接取缓存，不存在就调用获取
    cache[key] = cache[key] || fn.apply(this, arguments)
    // 返回缓存数据
    return cache[key]
  }
}
console.log(getArea);
const fn2 = memoize(getArea)
console.log(fn2(2));
console.log(fn2(2));
console.log(fn2(2));
console.log(fn2(2));
```

## 5.柯里化

> 概念：将函数的入参的一部分先传入，传入的这部分参数固定不变，等待接收剩余参数，最后将结果返回。
>

```js
// 要求封装一个函数使fn(1, 2, 3),fn(1, 2)(3),fn(1)(2, 3)值相等
// 柯里化函数
function curry (fn) {
  // 返回一个函数
  return function curried (...args) {
    // 判断实参长度和形参长度是否相等
    if (args.length < fn.length) {
      // 小于的话返回一个函数
        return function () {
          // 将剩余的参数和初始传递参数拼接之后一起传递，返回最终的结果
          return curried(...args.concat(Array.from(arguments)))
        }
    }
    // 长度相等的话，直接返回最终结果
    return fn(...args)
  }
}
// 创建一个算法函数
const getSum = curry((a, b, c) => a + b + c)
console.log(getSum(1, 2, 3));
console.log(getSum(1)(2, 3));
console.log(getSum(1)(2)(3));
```



## 6.函数组合

> 函数组合：将其他函数进行组合，形成一个新的函数。
>

```js
// fp模块
const fp = require('lodash/fp')
// const reverse = array => array.reverse()
// const last = array => array[0]
// const toUpper = s => s.toUpperCase() 
// const compose = (...args) => value => args.reverse().reduce((acc, fn) => fn(acc), value)
// 直接使用lodash的函数组合flowRight，柯里化函数toUpper，last，reverse,从右往左依次执行
const fn = fp.flowRight(fp.toUpper, fp.last, fp.reverse)
console.log(fn(['one', 'two', 'three'])); // 'THREE'
```

## 7.函子

> 概念：特殊的容器，用来存储值和值的变形关系。

### 7.1 Functor函子

```js
class Container {
  // 创建一个静态方法of用来创建实例对象
  static of (value) {
    return new Container(value)
  }

  // 存储一个私有的值，只能在函子内部使用
  constructor (value) {
    this._value = value
  }

  // 暴露一个map方法，该方法接受一个函数作为参数,返回一个处理之后的新的函子
  map (fn) {
    // return new Container(fn(this._value))
    return Container.of(fn(this._value)) 
  }
}

// const r = new Container('one')
//             .map(x => x.toUpperCase())
const r = Container.of('one')
            .map(x => x.toUpperCase())
console.log(r);
```

### 7.2 MayBe函子

> 处理空值的函子

```js
class MayBe {
  // 创建一个静态方法of用来创建实例对象
  static of (value) {
    return new MayBe(value)
  }
  // 存储一个私有的值，只能在函子内部使用
  constructor (value) {
    this._value = value
  }
  // 暴露一个map方法，该方法接受一个函数作为参数,返回一个处理之后的新的函子
  map (fn) {
    return this.isEmpty() ? MayBe.of(this._value) :  MayBe.of(fn(this._value))
  }
  // 判断值是否为空
  isEmpty () {
    return this._value === null || this._value === undefined
  }
}

const r = MayBe.of(undefined)
            .map(x => x.toUpperCase())
            
console.log(r);
```

### 7.3 Either函子

> 处理异常的函子

```js
// 处理异常
class Left {
  // 静态of
  static of (value) {
    return new Left(value)
  }
  // 存储一个私有的值，只能在函子内部使用
  constructor (value) {
    this._value = value
  }
  // 暴露一个map方法，该方法接受一个函数作为参数,返回本身
  map (fn) {
    return this
  }
}
// 处理正确数据
class Right {
  // 静态of
  static of (value) {
    return new Right(value)
  }
  // 存储一个私有的值，只能在函子内部使用
  constructor (value) {
    this._value = value
  }
  // 暴露一个map方法，该方法接受一个函数作为参数,返回
  map (fn) {
    return Right.of(fn(this._value))
  }
}

const left = Left.of(5)
              .map(x => x + 2)
const right = Right.of(5)
              .map(x => x + 2)
// console.log(left, right);

function parseString (str) {
  try {
    // 返回正确的结果
    return Right.of(JSON.parse(str))
  } catch (error) {
    // 处理异常，返回异常信息
    return Left.of({  error: error.message})
  }
}

console.log(parseString('{ neme: zs }')); // Left { _value: { error: 'Unexpected token n in JSON at position 2' } }
console.log(parseString('{ "neme": "zs" }')); // Right { _value: { neme: 'zs' } }
```

### 7.4 IO函子

> 内部存储一个函数，在需要时调用

```js
class IO {
  // 静态of接收一个值，返回一个函数,将来需要时在调用
  static of (x) {
    return new IO(() => x)
  }
  // 存储一个函数
  constructor (fn) {
    this._value = fn
  }
  // 创建一个新的IO，为了将当前的_value和map中传入的函数组合成新的函数作为IO的参数
  map (f) {
    return new IO(fp.flowRight(f, this._value))
  }
}
// IO 
const r = IO.of(process)
            // 返回node的执行路径 { _value: [Function] } 
            .map(x => x.execPath)
console.log(r._value()); // /usr/local/bin/node

```

### 7.5 Task函子

> 函子可以处理异步

```js
// 引入folktale的组合函数compose，curry
const { compose, curry } = require('folktale/core/lambda')
// folktale的curry
const f = curry(3, (x, y, z) => x + y + z)
console.log(f(1)(2)(3));

// 引入lodash的fp模块的函数
const { toUpper, first, split, find } = require('lodash/fp')
const fn = compose(toUpper, first)
const r = fn(['one', 'two'])
console.log(r);
// 引入folktale的异函数，返回一个函子
const { task } = require('folktale/concurrency/task')
const fs = require('fs')
// 读取文件
function readFile (filename) {
  // task传递一个函数，参数是resolver
  return task(resolver => {
    // 调用文件读取，接受三个参数，文件名，字符编码，回掉，错误优先
    fs.readFile(filename, 'utf-8', (err, data) => {
      if (err) resolver.reject(err)
      resolver.resolve(data)
    })
  })
}
// readFile调用返回的是Task函子，调用run方法
readFile('package.json')
  .map(split('\n'))
  .map(find(x => x.includes('version')))
  .run()
  // 监听run方法处理的结果
  .listen({
    onRejected: err => {
      console.log(err);
    },
    onResolved: data => {
      console.log(data);
    }
  })
```

### 7.6 Pointed函子

> Pointed 函子是实现了 of 静态方法的函子,避免了重复使用new来构建对象。
>
> of 方法用来把值放到上下文。

```js
class Container { 
// Point函子
// 作用是把值放到一个新的函子里面返回，返回的函子就是一个上下文
    static of (value) { 
        return new Container(value)
    }
}
```

### 7.7 Monad函子

> Monad 函子是可以变扁的 Pointed 函子，用来解决IO函子嵌套问题，IO(IO(x))。
>
>  一个函子如果具有 join 和 of 两个方法并遵守一些定律就是一个 Monad。

```js
class IO {
  // 静态of接收一个值，返回一个函数,将来需要时在调用
  static of (value) {
    return new IO(function () {
      return value
    })
  }
  // 存储一个函数
  constructor (fn) {
    this._value = fn
  }

  // 创建一个新的IO，为了将当前的_value和map中传入的函数组合成新的函数作为IO的参数
  map (fn) {
    return new IO(fp.flowRight(fn, this._value))
  }

  join () {
    return this._value()
  }

  // 同时调用 map join
  flatMap (fn) {
    return this.map(fn).join()
  }
}
const fp = require('lodash/fp')
const fs = require('fs')
// 读取文件
const readFile = filename => {
  // 返回一个IO函子等待调用处理
  return new IO(() => {
    return fs.readFileSync(filename, 'utf-8')
  })
}
// 打印上一步的IO函子
const print = x => {
  return new IO(() => {
    console.log(x);
    return x
  })
}

let r = readFile('package.json')
          .flatMap(print)
          .join()
```

#  JavaScript 异步编程

## 1.概念

- JavaScript 语言的执行环境是单线程的，一次只能执行一个任务，多任务需要排队等候，这种模式可能会阻塞代码，导致代码执行效率低下。为了避免这个问题，出现了异步编程。一般是通过 callback 回调函数、事件发布/订阅、Promise 等来组织代码，本质都是通过回调函数来实现异步代码的存放与执行。

## 2.EventLoop 事件环和消息队列

- **EventLoop** 是一种循环机制 ，不断去轮询一些队列 ，从中找到 需要执行的任务并按顺序执行的一个执行模型。
- **消息队列** 是用来存放宏任务的队列， 比如定时器时间到了， 定时间内传入的方法引用会存到该队列， ajax回调之后的执行方法也会存到该队列。

![image-20210422130003619](/Users/wkxk/Library/Application Support/typora-user-images/image-20210422130003619.png)

> 一开始整个脚本作为一个宏任务执行。执行过程中同步代码直接执行，宏任务等待时间到达或者成功后，将方法的回调放入宏任务队列中，微任务进入微任务队列。
>
> 当前主线程的宏任务执行完出队，检查并清空微任务队列。接着执行浏览器 UI 线程的渲染工作，检查web worker 任务，有则执行。
>
> 然后再取出一个宏任务执行。以此循环...

## 3.宏任务与微任务

- **宏任务**可以理解为每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）。
  - 浏览器为了让 JS 内部宏任务 与 DOM 操作能够有序的执行，会在一个宏任务执行结束后，在下一个宏任务执行开始前，对页面进行重新渲染。
  - 宏任务包含：script(整体代码)、setTimeout、setInterval、I/O、UI交互事件、MessageChannel 等

- **微任务**可以理解是在当前任务执行结束后需要立即执行的任务。也就是说，在当前任务后，在渲染之前，执行清空微任务。

  所以它的响应速度相比宏任务会更快，因为无需等待 UI 渲染。

  - 微任务包含：Promise.then、MutaionObserver、process.nextTick(Node.js 环境)等

## 4.Promise手写实现

```js
// 初始状态
const PENDING = "pending";
// 完成状态
const FULFILLED = "fulfilled";
// 失败状态
const REJECTED = "rejected";

// 异步执行方法封装
function asyncExecFun(fn) {
  setTimeout(() => fn(), 0);
}

// 执行promise resolve功能
function resolvePromise(promise, res, resolve, reject) {
  // 返回同一个promise
  if (promise === res) {
    reject(new TypeError("Chaining cycle detected for promise #<MyPromise>"));
    return;
  }
  // promise结果
  if (res instanceof MyPromise) {
    res.then(resolve, reject);
  } else {
    // 非promise结果
    resolve(res);
  }
}

/**
 * 1. 是个构造函数
 * 2. 传入一个可执行函数 函数的入参第一个为 fullFill函数 第二个为 reject函数；  函数立即执行，  参数函数异步执行
 * 3. 状态一旦更改就不可以变更  只能 pending => fulfilled 或者  pending => rejected
 * 4. then 的时候要处理入参的情况 successCallback 和failCallback 均可能为非函数
 *      默认的 failCallback 一定要将异常抛出， 这样下一个promise便可将其捕获 异常冒泡的目的
 * 5. then 中执行回调的时候要捕获异常 将其传给下一个promise
 *    如果promise状态未变更 则将回调方法添加到对应队列中
 *    如果promise状态已经变更 需要异步处理成功或者失败回调
 *    因为可能出现 回调结果和当前then返回的Promise一致 从而导致死循环问题
 * 6. catch只是then的一种特殊的写法 方便理解和使用
 * 7. finally 特点 1. 不过resolve或者reject都会执行
 *                2. 回调没有参数
 *                3. 返回一个Promise 且值可以穿透到下一个then或者catch
 * 8. Promise.resolve, Promise.reject 根据其参数返回对应的值 或者状态的Promise即可
 * 9. Proise.all 特点  1. 返回一个Promise
 *                    2. 入参是数组 resolve的情况下出参也是数组 且结果顺序和调用顺序一致
 *                    3. 所有的值或者promise都完成才能resolve 所有要计数
 *                    4. 只要有一个为reject 返回的Promise便reject
 * 10. Proise.race 特点 1. 返回一个Promise
 *                    2. 入参是数组 那么出参根据第一个成功或者失败的参数来确定
 *                    3. 只要有一个resolve 或者reject 便更改返回Promise的状态
 *
 *
 */

class MyPromise {
  status = PENDING;
  value = undefined;
  reason = undefined;
  successCallbacks = [];
  failCallbacks = [];
  constructor(exector) {
    // 立即执行传入参数
    // 参数直接写为 this.resolve  会导致函数内 this指向会发生改变
    // 异步执行状态变更
    // 捕获执行器的异常
    try {
        exector(
          (value) => asyncExecFun(() => this.resolve(value)),
          (reason) => asyncExecFun(() => this.reject(reason))
        );
    } catch (e) {
        this.reject(e)
    }
  }

  resolve(value) {
    // 如果状态已经变更则直接返回
    if (this.status !== PENDING) return;
    this.value = value;
    this.status = FULFILLED;
    // 执行所有成功回调
    while (this.successCallbacks.length) this.successCallbacks.shift()();
  }

  reject(reason) {
    // 如果状态已经变更则直接返回
    if (this.status !== PENDING) return;
    this.reason = reason;
    this.status = REJECTED;
    if(!this.failCallbacks.length){
        throw '(in MyPromise)'
    }
    // 执行所有失败回调
    while (this.failCallbacks.length) this.failCallbacks.shift()();
  }
  then(successCallback, failCallback) {
    // 成功函数处理 忽略函数之外的其他值
    successCallback =
      typeof successCallback == "function" ? successCallback : (v) => v;
    // 失败函数处理 忽略函数之外的其他值 抛出异常  实现catch冒泡的关键
    failCallback =
      typeof failCallback == "function"
        ? failCallback
        : (reason) => {
            throw reason;
          };

    let promise = new MyPromise((resolve, reject) => {
      // 统一异常处理逻辑
      const execFun = (fn, val) => {
        try {
          let res = fn(val);
          resolvePromise(promise, res, resolve, reject);
        } catch (e) {
          reject(e);
        }
      };
      // 执行成功回调
      const execSuccessCallback = () => execFun(successCallback, this.value);
      // 执行失败回调
      const execFailCallback = () => execFun(failCallback, this.reason);
      // 同步将对应成功或者失败回调事件加入对应回调队列
      if (this.status === PENDING) {
        // 将成功回调加入队列
        this.successCallbacks.push(execSuccessCallback);
        // 讲失败回调加入队列
        this.failCallbacks.push(execFailCallback);
        return;
      }
      // 延迟执行 可以将函数执行结果和当前then 返回的promise 进行比较
      asyncExecFun(() => {
        // 如果已经 fulfilled 可直接调用成功回调方法
        if (this.status === FULFILLED) {
          execSuccessCallback();
          // 如果已经 rejected 可直接调用失败回调方法
        } else if (this.status === REJECTED) {
          execFailCallback();
        }
      });
    });
    return promise;
  }

  catch(failCallback) {
    return this.then(undefined, failCallback);
  }

  finally(callback) {
    return this.then(
      // 穿透正常值
      (value) => MyPromise.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          // 穿透异常信息
          throw reason;
        })
    );
  }

  static resolve(value) {
    // 如果是MyPromise 实例 则直接返回
    if (value instanceof MyPromise) return value;
    // 如果是MyPromise 实例 否则返回一个 MyPromise实例
    return new MyPromise((resolve) => resolve(value));
  }
  static reject(reason) {
    // 如果是MyPromise 实例 则直接返回
    if (reason instanceof MyPromise) return reason;
    // 如果是MyPromise 实例 否则返回一个 MyPromise实例
    return new MyPromise((resolve, reject) => reject(reason));
  }

  // all方法
  static all(array) {
    // 存储结果
    let result = [];
    // 存储数组长度
    let len = array.length;
    // 创建返回MyPromise
    let promise = new MyPromise((resolve, reject) => {
      // 定义当前MyPromise的索引
      let index = 0;
      // 添加数据的公用方法
      function addData(key, data) {
        // 赋值
        result[key] = data;
        // 索引递增
        index++;
        // 全部执行完则resolve
        if (index == len) {
          resolve(result);
        }
      }
      // 按顺序变量数组
      for (let i = 0; i < len; i++) {
        let curr = array[i];
        // 如果是MyPromise则 按其规则处理
        if (curr instanceof MyPromise) {
          curr.then((value) => addData(i, value), reject);
        } else {
          // 非MyPromise直接赋值
          addData(i, curr);
        }
      }
    });
    // 返回新的MyPromise实例
    return promise;
  }
  // 只要有一个成功或者失败就返回
  static race(array) {
    let promise = new MyPromise((resolve, reject) => {
      for (let i = 0; i < array.length; i++) {
        let curr = array[i];
        // MyPromise实例 结果处理
        if (curr instanceof MyPromise) {
          curr.then(resolve, reject);
        } else {
          // 非MyPromise实例处理
          resolve(curr);
        }
      }
    });
    return promise;
  }
}

module.exports = MyPromise;
```



