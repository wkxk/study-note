# 项目思路文档说明

```js
/**
 * 1.yarn add gulp --dev 开发环境安装gulp
 * 
 * 2.导入src(源文件),dest(目标文件),parallel(任务并行),series(任务串行),watch(文件监听)
 * const { src, dest, parallel, series, watch } = require('gulp')
 * 
 * 3.导入plugins工具类
 * const loadPlugins = require('gulp-load-plugins')
 * const plugins = loadPlugins()
 * 
 * 4.yarn add del --dev 开发环境安装del,删除文件用
 * const del = require('del')
 * 
 * 5.yarn add browser-sync --dev 开发环境安装browser-sync，启动web服务
 * const browserSync = require('browser-sync')
 * const bs = browserSync.create()
 * 
 * 6.实现一个清除任务clean
 * 
 * 7.实现样式style编译任务
 * 8.实现script解析任务
 * 9.实现page模板解析任务
 * 10.实现image压缩任务
 * 11.实现font压缩任务
 * 12.实现extra提取任务
 * 13.实现useref对html，js，css压缩任务
 * 14.实现serve启动浏览器服务
 * 15.组合任务实现了build，develop任务
 * 
 */
```

