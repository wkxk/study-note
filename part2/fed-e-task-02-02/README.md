# 一、简答题

#### 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

- 初始化参数：初始化根据用户在命令窗口输入的参数以及 webpack.config.js 文件的配置
- 开始编译：根据上一步得到的最终配置初始化得到一个 compiler 对象，注册所有的插件 plugins，插件开始监听 webpack 构建过程的生命周期的环节（事件），不同的环节会有相应的处理，然后开始执行编译。
- 确定入口：根据 webpack.config.js 文件中的 entry 入口，开始解析文件构建 AST 语法树，找出依赖，递归下去。
- 编译模块：递归过程中，根据文件类型和 loader 配置，调用相应的 loader 对不同的文件做不同的转换处理，再找出该模块依赖的模块，然后递归本步骤，直到项目中依赖的所有模块都经过了本步骤的编译处理。
- 编译过程中：在不同的环节执行一系列的插件。
- 完成编译并输出：递归结束后，得到每个文件结果，包含转换后的模块以及他们之间的依赖关系，根据 entry 以及 output 等配置生成代码块 chunk。
- 打包完成：根据 output 输出所有的 chunk 到相应的文件目录。

#### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

Loader，直译为"加载器"。主要是用来解析和检测对应资源，负责源文件从输入到输出的转换，它专注于实现资源模块加载。

Plugin，直译为"插件"。主要是通过webpack内部的钩子机制，在webpack构建的不同阶段执行一些额外的工作，它的插件是一个函数	或者是一个包含apply方法的对象，接受一个compile对象，通过webpack的钩子来处理资源。

- Loader开发思路
  - 通过module.exports导出一个函数
  - 该函数默认参数一个参数source(即要处理的资源文件)
  - 在函数体中处理资源(loader里配置响应的loader后)
  - 通过return返回最终打包后的结果(这里返回的结果需为字符串形式)

- Plugin开发思路
  - 通过钩子机制实现
  - 插件必须是一个函数或包含apply方法的对象
  - 在方法体内通过webpack提供的API获取资源做响应处理
  - 将处理完的资源通过webpack提供的方法返回该资源

# 二、编程题

#### 1、使用 Webpack 实现 Vue 项目打包任务

具体任务及说明：

1. 在 code/vue-app-base 中安装、创建、编辑相关文件，进而完成作业。
2. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
3. 有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
4. 这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务
5. 尽可能的使用上所有你了解到的功能和特性



**提示：(开始前必看)**

在视频录制后，webpack 版本以迅雷不及掩耳的速度升级到 5，相应 webpack-cli、webpack-dev-server 都有改变。

项目中使用服务器的配置应该是改为下面这样：

```json
// package.json 中部分代码
"scripts": {
	"serve": "webpack serve --config webpack.config.js"
}
```

vue 文件中 使用 style-loader 即可

其它问题, 可先到 https://www.npmjs.com/ 上搜索查看相应包的最新版本的配置示例, 可以解决大部分问题.



#### 作业要求

本次作业中的编程题要求大家完成相应代码后

- 提交一个项目说明文档，要求思路流程清晰。
- 或者简单录制一个小视频介绍一下实现思路，并演示一下相关功能。
- 最终将录制的视频或说明文档和代码统一提交至作业仓库。



# 开发思路

1. 项目运行
   - `yarn install` 安装依赖
   - `yarn serve` 开启服务
   - `yarn build` 打包
   - `yarn lint` 校验
2. 配置`webpack.common.js`
   - `entry`入口文件
   - `output`输出文件
     - `filename` 输出文件名
     - `path` 输出文件路径
   - `loader` 加载器
     - 编译vue文件：`vue-loader`/ `vue-template-compiler` /`VueLoaderPlugin`
     - JavaScript新特性语法编译: `babel-loader`/`@babel/core`/`@babel/preset-env`
     - less编译：`less-loader`
     - css编译：`css-loader` `style-loader`
     - 文件资源编译：`url-loader`
   - `plugin`配置
     - `HtmlWebpackPlugin` 根据模板HTML文件生成页面
     - `VueLoaderPlugin` 解析vue文件
   - `devServer`配置
     - `contentBase` 静态资源路径
     - `port` 端口
     - `hot` 开启热加载
     - `open` 开启浏览器
3. 配置`webpack.dev.js`
   - `webpack-merge` 配置合并
   - `mode` 环境配置
4. 配置`webpack.prod.js`
   - `webpack-merge` 配置合并
   - `mode` 环境配置