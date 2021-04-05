class Container {
  // 提供一个静态的of，返回一个新的Container函子
  static of (value) {
    return new Container(value)
  }
  constructor (value) {
    this._value = value
  }
  // 提供一个map方法,接收一个处理值的函数，返回一个Container函子
  map (fn) {
    return Container.of(fn(this._value))
  }
} 

class Maybe {
  // 提供一个静态的of，返回一个新的Maybe函子
  static of (x) {
    return new Maybe(x)
  }
  constructor (value) {
    this._value = value
  }
  isNothing() {
    return this._value === null || this._value === undefined
  }
  map (fn) {
    return this.isNothing() ? this : Maybe.of(fn(this._value))
  }
}

module.exports = { Container, Maybe }