const marked = require('marked')
module.exports = source => {
  // console.log(source);
  // return 'console.log("hello ~")'
  const html = marked(source)
  // 1.返回一个js代码
  // return `module.exports = ${JSON.stringify(html)}`
  // return `export default ${JSON.stringify(html)}`
  // 2.返回一个html字符串，交给下一个loader处理
  return html
}