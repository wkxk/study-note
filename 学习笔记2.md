# Part1-2 ES新特性与TypeScript、JS性能优化 

## 1.ECMAScript

> ECMAScript（简称ES）通常被认为是JavaScript的标准化规范，JavaScript是ECMAScript的扩展语言。ECMAScript从2015年开始之后，开始使用年份来命名，ECMAScript2015也成ES6，后续的ES2016，ES2017，ES2018。

## 2.ES新特性

### 2.1 let、const和var的区别

```js
// let const 形成一个块级作用域,不会有变量声明的提升
// let用来声明变量
// for (var i = 0; i < 3; i++) {
//   console.log(i);
// }
// console.log(i);
for (let i = 0; i < 3; i++) {
  console.log(i);
}
// console.log(i);

// const声明常量,一旦声明之后不能在更改
const b = 1;
```

### 2.2 数组的解构

```js
// 数组的解构
const arr = ['one', 'two', 'three']
const [, str1,str] = arr
console.log(str1, str); // two three
```

### 2.3 对象的解构

```js
// 对象的解构
const obj = {
  name: 'zs'
}
// :后设置别名，防止命名冲突
const { name: namea } = obj
console.log(namea);
```

### 2.4 模板字符串

```js
// 模板字符串
// const str = `123`
// 带标签的模板字符串，可以用来处理字符串中的插值数据
const name = 'tom'
const gender = true
const tag = (s, name, gender) => {
  console.log(s, name, gender);
  const sex = gender ? 'man' : 'women'
  return s[0] + name + s[1] + sex
}
const str1 = tag`hi, my name is ${name}, I am a ${gender}`
console.log(str1); // hi, my name is tom, I am a man
```

### 2.5 箭头函数

```js
// 箭头函数
const fn = (a, b) => a + b 
const arr = [1, 2, 3]
const result = arr.filter(v => v % 2)
// 不会改变this指向
const obj = {
  name: 'zs',
  sayHi: function () {
    console.log('my name is ' + this.name);
  },
  sayHi1: () => {
    console.log('my name is ' + this.name);
  }
}
obj.sayHi() // my name is zs
// this作用于当前作用域，上下文
obj.sayHi1() // my name is undefined
```

### 2.6 对象字面量

```js
// 对象字面量
const name = 'zd'
const age = '18'
const obj1 = {
  name,
  age,
  // fn: function () {}
  fn () {
    console.log(this);
  }
}
console.log(obj1); // { name: 'zd', age: '18', fn: [Function: fn] }
obj1.fn() // { name: 'zd', age: '18', fn: [Function: fn] }
```

### 2.7 Proxy

```js
// proxy
const obj = {
  name: 'zs',
  age: 18
}
const proxyObj = new Proxy(obj, {
  get (target, property) {
    console.log(target, property);
    // return 100
    return property in target ? target[property] : 'none'
  },
  set (target, property, value) {
    if (property === 'age') {
      if (!Number.isInteger(value)) {
        throw new Error('Error')
      }
    }
    target[property] = value
  },
  deleteProperty (target, property) {
    console.log(target, property);
    delete target[property]
  }
})
// proxyObj.age = '19' // Error
proxyObj.age = 19 // { name: 'zs', age: 19 }
console.log(proxyObj.name); // zs
console.log(proxyObj.name1); // none

// Proxy和defineProperty对比
delete proxyObj.name
console.log(proxyObj);

const p1 = {}
Object.defineProperty(p1, 'age', {
  get () {
    console.log('age访问了');
    return p1._age
  },
  set (val) {
    console.log('age设置了');
  }
})
Object.defineProperty(p1, 'name', {
  get () {
    console.log('name访问了');
    return p1._name
  },
  set (val) {
    console.log('name设置了');
  }
})
p1.age = 1
console.log(p1.age);
```

> Proxy数据劫持的方式比Object.defineProperty更加方便，新增了很多Object.defineProperty不具备的方法。

### 2.8 Reflect

```js
// Reflect 
const obj = {
  name: 'zs',
  age: 18
}
const proxyObj = new Proxy(obj, {
  get (target, property) {
    console.log(target, property);
    return Reflect.get(target, property)
  }
})
console.log(proxyObj.name);
// 统一操作对象的api
console.log(
  Reflect.has(obj, 'name'),
  Reflect.ownKeys(obj),
  Reflect.deleteProperty(obj, 'age'),
)
```

### 2.9 class类

```js
// class
// function Person (name) {
//   this.name = name
// }
// Person.prototype.say = function () {
//   console.log(`${this.name}`);
// }
class Person {
  constructor (name) {
    this.name = name
  }

  say () {
    console.log(`my name is ${this.name}`);
  }
}
const p = new Person('tom')
p.say()
```

#### 2.9.1 static静态修饰词

```js
// 静态方法修饰词static
class Person {
  constructor (name) {
    this.name = name
  }

  say () {
    console.log(`my name is ${this.name}`);
  }

  static create (val) {
    return new Person(val)
  }
}
Person.create('zs').say()
```

#### 2.9.2 继承extends

```js
// extends继承
class Teacher {
  constructor (name, age) {
    this.name = name
    this.age = age
  }
  say () {
    console.log(`my name is ${this.name}, i am ${this.age} years old`);
  }
}

class Student extends Teacher {
  constructor (name, age, num) {
    // 调用父级的属性
    super(name, age)
    this.num = num
  }

  hello () {
    // 调用父级的方法
    super.say()
    console.log(`my num is ${this.num}`);
  }
}
const s = new Student('jack', 12, 123)
s.hello()
// my name is jack, i am 12 years old
// my num is 123
```

### 2.10 set数据结构

```js
// set数据结构
const s = new Set()
// add:往set中添加元素
s.add(1).add(2).add(3)
console.log(s); // Set { 1, 2, 3 }
// for of遍历
for (let i of s) {
  console.log(i);
}
// size：长度
console.log(s.size);
// has:判断是否有某个元素
console.log(s.has(100));
// delete:删除某个元素,删除成功返回true，反之返回false
console.log(s.delete(1));
// clear:清空set
s.clear()
console.log(s); // Set {}
// 数组去重
const arr = new Set([1, 2, 2, 3, 1, 5, 5])
console.log(arr); // Set { 1, 2, 3, 5 }
console.log([...arr]); // [ 1, 2, 3, 5 ]
console.log(Array.from(arr));// [ 1, 2, 3, 5 ]
```

### 2.11 map数据结构

```js
// map数据结构
// 可以使用任意类型的值作为健
// 普通对象结构
const obj = {}
obj[123] = 123
obj[true] = 345
obj[{a: 123}] = 456
// 会自动将值toString之后作为健
console.log(obj); // { '123': 123, true: 345, '[object Object]': 456 }
console.log(obj[{}]); // 456

// map 
const m = new Map()
const a = { name: 'tom'}
m.set(a, 10)
m.set(true, 101)
m.set(123, 16)
// 遍历
m.forEach((value, key) => {
  console.log(value, key);
})
// 10 { name: 'tom' }
// 101 true
// 16 123
console.log(m); // Map { { name: 'tom' } => 10 }
console.log(m.get(a)); // 10
m.delete(a)
console.log(m); // Map { true => 101, 123 => 16 }
// 清空
m.clear()
console.log(m); // Map {}
```

### 2.12 Symbol 数据类型

> Symbol 数据类型

```js
// 独一无二的存在
const s1 = Symbol()
const s2 = Symbol()
console.log(s1 === s2); // false
// 可以给Symbol设置一个别称用于区分
console.log(
  Symbol('a'),
  Symbol('b'),
  Symbol('c'),
);
// Symbol(a) Symbol(b) Symbol(c)
// 为对象设置一个独一无二的属性
const name = Symbol()
const obj = {
  [name]: 'zs',
  say() {
    console.log(`my name is ${this[name]}`);
  }
}
obj.say()

// Symbol.for方法,参数会调用toString方法转成字符串
console.log(Symbol.for('foo') === Symbol.for('foo')); // true
console.log(Object.getOwnPropertySymbols(obj)); // [ Symbol() ]
const obj1 = {
  [Symbol.toStringTag]: 'xObj' // [object xObj]
}
console.log(obj1.toString()); // [object Object]

```

### 2.13 for...of遍历

> for of 遍历所有数据结构的一种方式

```js
// 数组的遍历,可以随时使用break停止遍历
const arr = [1, 2, 3, 3, 5]

for (const item of arr) {
  if (item > 2) {
    break
  }
  console.log(item);
}
// set遍历
const s = new Set([1, 2, 3])
for (const i of s) {
  console.log(i);
}
// map遍历
const m = new Map()
m.set('name', 'zs')
m.set('age', 18)
for (const [key, value] of m) {
  console.log(key, value);
}
// 普通对象不可遍历,obj is not iterable报错
// const obj = { a: 1, b: 2}
// for (const v of obj) {
//   console.log(v);
// }
```

### 2.14 Iterable可迭代接口

```js
// Iterable 可迭代接口
// 实现Iterable接口是for...of...的前提
// iterator迭代器
const arr = ['one', 'two']
const iterator = arr[Symbol.iterator]()
console.log(iterator.next()); // { value: 'one', done: false }
console.log(iterator.next()); // { value: 'two', done: false }
console.log(iterator.next()); // { value: undefined, done: true }

// 实现 Iterable 可迭代接口
const obj = {
  store: ['one', 'two', 'three'],
  // 返回一个迭代器方法
  [Symbol.iterator]: function () {
    const self = this
    let index = 0
    // 返回一个实现迭代器对象
    return {
      // 提供一个next方法
      next: function () {
        // 返回迭代结果
        const result = {
          value: self.store[index], // 存储结果
          done: index >= self.store.length // 表示迭代状态
        }
        index++
        return result
      }
    }
  }
}
for (const key of obj) {
  console.log(key);
}
```

## 3.TypeScript

### 3.1 断言

```js
const arr = [100, 200, 300]
const res = arr.find(x => x > 0)
// 设置断言的两种方式
const num  = res as number
const num1 = <number>res
// const num1 = res * res
```

### 3.2 枚举

```js
// 默认从0开始累加
enum Status {
  Empty, 
  One,
  Two
}
// 设置初始值之后后面的值累加
// enum Status {
//   Empty = 6, 
//   One,
//   Two
// }
// 设置字符串之后，后面的值都要设置为字符串
// enum Status {
//   Empty = 'abc', 
//   One = 'bcd',
//   Two = 'edg'
// }

const obj = {
  value: Status.Empty // 1, 2
}
```

### 3.3 元组类型

```js
// 明确元素数量，以及每一个元素类型的一个数组
const tuple: [number, string] = [1, '2']
const [age, name] = tuple
Object.entries({
  name: 'zs',
  age: 18
})
```

### 3.4 数组

```js
// 常用的两种方式
const arr1: Array<number> = [1, 2]
const arr2: number[] = [222, 333]

function getSum (...args: number[]) {
  return args.reduce((a, c) => a + c, 0)
}
getSum(1, 2)
```

### 3.5 对象

```js
const foo: object = [] // {} function
const obj1: { foo: number } = { foo: 1 }
```

### 3.6 interface接口

```js
// 接口
interface Post {
  name: string
  age: number
  title?: string // 可有可无
  readonly nickname?: string // 只读属性
}
function say (obj: Post) {
  console.log(obj.name);
  console.log(obj.age);
}
say({
  name: 'sz',
  age: 18
})

interface cash {
  // key可以是任意字符串，是用来约束健值的，声明其类型
  [key: string]: string
}
const cash: cash = {}
cash.a = '12'
cash.b = '12'

```

### 3.7 class类

```js
class Person {
  public name: string // 公众属性
  private age: number // 私有属性
  protected readonly gender: boolean // 只读

  constructor (name: string, age: number) {
    this.name = name
    this.age = age
    this.gender = true
  }

  sayHi (msg: string) {
    console.log(`I am a ${this.name}, ${msg}`);
  }
}

class Student extends Person {
  constructor (name: string, age: number) {
    super(name, age)
  }
}

const p1 = new Person('zs', 18)
console.log(p1.name);
// console.log(p1.age); // 报错
// console.log(p1.gender); // 报错

// 类
interface Eat {
  eat (food: string): void
}
interface Run {
  run (food: string): void
}


class Person implements Eat, Run {
  eat (food: string): void {
    console.log(food);
  }
  run (distance: string): void {
    console.log(distance);
  }
}

class Dog implements Eat, Run {
  eat (food: string): void {
    console.log(food);
  }
  run (distance: string): void {
    console.log(distance);
  }
}

// 抽象类
abstract class Animal {
  eat (food: string): void {
    console.log(food);
  }
  abstract run (distance: string): void
}

class Dog1 extends Animal {
  run(distance: string): void {
    console.log(distance);
  }
  
}
```

### 3.8 范型

```js
// 声明的函数民航后面<T>,不确定类型：T
function ceateArr<T> (length: number, value: T): T[] {
  const res = Array<T>(length).fill(value)
  return res
}

ceateArr(3, 100)
ceateArr(3, '100')

const cetAA = <T>(length: number, value: T): T[] => {
  const res = Array<T>(length).fill(value)
  return res
}
cetAA(12, 12)
cetAA(12, '12')
```

## 4. js性能优化

### V8引擎常用的GC回收算法

```js
// 性能优化
// gc回收机制
/**
 * 1.引用计数方法
 * 核心思想：设置引用数，判断当前引用计数是否为0
 * 引用计数器，引用关系改变时修改引用数值，引用计数为0时，回收
 * 优点：发现垃圾时立即回收，最大程度减少程序暂停
 * 缺点：无法回收循环引用的对象，时间开销大
 */

/**
 * 2.标记清除算法
 * 核心思想：分标记和清除两个阶段完成
 * 遍历所有对象找标记活动对象
 * 遍历所有对象清除没有标记对象
 * 回收相应空间
 * 优点：解决了无法回收循环引用的对象的问题
 * 缺点：造成了空间碎片化，不会立即回收
 */

/**
 * 2.标记整理算法
 * 核心思想：分标记和清除两个阶段完成
 * 遍历所有对象找标记活动对象
 * 遍历所有对象清除没有标记对象
 * 回收之前先进行整理，调整位置
 * 回收相应空间
 * 优点：解决了无法回收循环引用的对象的问题
 * 缺点：减少了空间碎片化
 */
 
/**
 * V8垃圾回收策略：
 * 1. 采用分代回收思想
 * 2. 内存分为新生代和老生代
 * 3. 针对不同对象采用不同算法
 */

/**
 * 常用的回收算法：
 * 1. 分代回收
 * 2. 空间复制
 * 3. 标记清除
 * 4. 标记整理
 * 5. 标记增量
 */

/**
 * V8内存分配：
 * 1. 内存一分为二
 * 2. 小空间用来存储新生代对象，即存活时间较短的对象（64位系统32M ｜ 32位系统16M）
 * 
 * 新生代对象回收机制：
 * 1. 采用复制算法+标记整理
 * 2. 新生代内存分为两个同等大小空间
 * 3. 使用空间From，用于存储活动对象，空闲空间To
 * 4. 标记整理之后，将活动对象拷贝至空闲空间To
 * 5. From与To交换空间达到内存释放
 * 
 * 细节说明：
 * 1. 拷贝过程可能出现晋升（将新生代对象移动到老生代）
 * 2. 一轮过后依然存活的新生代对象
 * 3. To空间使用达到25%，触发晋升
 */

/**
 * 老生代回收：
 * 64位系统1.4G，32位系统700M
 * 老生代对象就是存活时间较长的对象
 * 
 * 回收机制：
 * 1. 标记清除，标记整理，增量标记，这些算法实现
 * 2. 先试用标记清除，回收垃圾释放空间
 * 3. 使用标记整理优化内存空间
 * 4. 使用增量标记进行效率优化
 * 
 */
```