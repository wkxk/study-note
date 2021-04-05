// 实现这个项目的构建任务
// 导入gulp的工具函数
// parallel 任务并行, series 任务串行
const { src, dest, parallel, series, watch } = require('gulp')
// plugins方法
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
// 删除
const del = require('del')
// 浏览器service
const browserSync = require('browser-sync')
const bs = browserSync.create()

// 无法下载
// const imagemin = require('gulp-imagemin')

const data = {
  pkg: require('./package.json'),
  date: new Date()
}

// 清除任务
const clean = () => {
  return del(['dist', 'temp'])
}

// css
const style = () => {
  // 样式所在路径，base用来指定存放对应的目录结构
  return src('src/assets/styles/*.scss', { base: 'src' })
    // sass样式编译，{ outputStyle: 'expanded' } 最后的}会换行
    .pipe(plugins.sass({ outputStyle: 'expanded' }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

// js
const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

// html
const page = () => {
  return src('src/*.html', { base: 'src'})
    .pipe(plugins.swig({ data, defaults: { cache: false } }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

// 图片
const image = () => {
  return src('src/assets/images/**', { base: 'src'})
    // .pipe(imagemin())
    .pipe(dest('dist'))
}

// 字体
const font = () => {
  return src('src/assets/fonts/**', { base: 'src'})
    // .pipe(imagemin())
    .pipe(dest('dist'))
}
// public
const extra = () => {
  return src('public/**', { base: 'public'})
    .pipe(dest('dist'))
}
// js，css，html文件压缩
const useref = () => {
  return src('temp/*.html', { base: 'temp' })
    .pipe(plugins.useref({ searchPath: ['temp', '.'] }))
    // html,js,css
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({ 
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    })))
    .pipe(dest('dist'))
}
// 启动服务
const serve = () => {
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload)

  bs.init({
    notify: false,
    port: 2080,
    open: false,
    // files: 'dist/**',
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}
// 编译
const compile = parallel(style, script, page)
// build
const build = series(
  clean, 
  parallel(
    series(compile, useref), 
    image, 
    font, 
    extra
  )
) 
// 开发环境
const develop = series(compile, serve)

module.exports = {
  clean,
  build,
  develop,
  serve
}
