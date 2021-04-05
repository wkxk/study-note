// 生成器入口文件
// 1.引入生成器工具类
const Generator = require('yeoman-generator')
// 引入文件工具函数
const fs = require('fs');
const path = require('path');

// 2.导出一个继承自Generator的类
module.exports = class extends Generator {
  // 3.引导用户输入
  prompting () {
    // 返回一个Promise对象
    // prompt接收一个数组作为参数
    return this.prompt([
      {
        type: 'input', // 输入类型
        name: 'name', // 输入的内容
        message: 'Your project name', // 给用户的提示语
        default: this.appname // 默认取项目名称
      }
    ])
    .then(answers => {
      // 保存用户输入的答案
      this.answers = answers
    })
  }
  // 默认执行此方式
  writing () {
    // 定义一个数组容器
    let result = []
    // 模板文件夹中忽略的文件
    const ignoreArr = ['.DS_Store']
    // 定义一个读取文件的方法，传入一个路径作为参数
    const readFile = filePath => {
      // 通过同步读取文件，返回一个包含该路径下的所有文件路径数组
      const arr = fs.readdirSync(filePath)
      // 遍历文件路径数组
      arr.forEach(filename => {
        // 拿到每一个路径所对应的绝对路径
        const filedir = path.join(filePath, filename);
        // 拿到每一个绝对路径下对应的文件信息
        const stats = fs.statSync(filedir)
        // 来判断是否为文件夹类型
        var isDir = stats.isDirectory(); 
        if (isDir) {
          // 如果是文件夹类型，递归获取文件
          readFile(filedir)
        } else {
          // 如果是文件类型，我们提取文件的相对路径
          const files = filedir.replace(`${this.templatePath()}/`, '')
          // 把所有文件的相对路径保存起来
          result.push(files)
        }
      })
      // 过滤掉需要忽略的文件
      return result.filter(v => !ignoreArr.includes(v))
    }
    // 以模板文件夹所在路径作为文件读取的开始
    const arr = readFile(this.templatePath())
    // 遍历
    arr.forEach(val => {
      // 4.通过copyTpl可以对应的文件复制到目标位置
      this.fs.copyTpl(
        // 模板文件夹中的文件路径
        this.templatePath(val),
        // 目标路径
        this.destinationPath(`${this.answers.name}/${val}`),
        // 输入的答案，用来替换项目中使用jsx占位的内容
        this.answers
      )
    })
  }
}