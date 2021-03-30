const path = require('path')
const webpack = require('webpack')
// module.exports = {
//   // 打包环境
//   mode: 'none',
//   // 入口文件
//   entry: './src/main.js',
//   // 输出文件
//   output: {
//     // 输出文件名
//     filename: 'bundle.js',
//     // 输出文件路径
//     path: path.join(__dirname, 'dist'),
//     // 输出文件目录
//     publicPath: 'dist/'
//   },
//   module: {
//     rules: [
//       {
//         test: /.js$/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env']
//           }
//         }
//       },
//       {
//         test: /.css$/,
//         // 从后往前运行
//         use: [
//           'style-loader',
//           'css-loader'
//         ]
//       },
//       {
//         test: /.png$/,
//         // 小文件使用Data URLs，减少请求次数
//         // use: 'url-loader',
//         // 大文件单独提取存放，提高加载速度
//         // use: 'file-loader',
//         // 超出10kb的文件单独存放，小于10kb文件装换位Data URLs嵌入代码中
//         use: {
//           loader: 'url-loader',
//           options: {
//             limit: 10 * 1024 // 10KB
//           }
//         }
//       },
//       // 打包html
//       {
//         test: /.html$/,
//         use: {
//           loader: 'html-loader',
//           options: {
//             // 指定img的src属性，a链接的href属性
//             attrs: ['img:src', 'a:href']
//           }
//         }
//       }
//     ]
//   }
// }

// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')

// class MyPlugin {
//   apply (compiler) {
//     console.log('myplugin qidong');
//     compiler.hooks.emit.tap('MyPlugin', compilation => {
//       for (let key in compilation.assets) {
//         // console.log(key);
//         console.log(compilation.assets[key].source());
//         if (key.endsWith('.js')) {
//           const contents = compilation.assets[key].source()
//           const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
//           compilation.assets[key] = {
//             source: () => withoutComments,
//             size: () => withoutComments.length
//           }
//         }
//       }
//     })
//   }
// }

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    // publicPath: 'dist/'
  },
  devtool: 'source-map',
  // 集中配置内部的优化功能
  optimization: {
    usedExports: true, // 只导出外部使用了的成员 
    concatenateModules: true,
    minimize: true // 压缩代码
  },
  devServer: { 
    hotOnly: true
    // contentBase: './public',
    // proxy: {
    //   '/api': {
    //     // http://localhost:8080/api/users -> https://api.github.com/api/users
    //     target: 'https://api.github.com',
    //     // http://localhost:8080/api/users -> https://api.github.com/users
    //     pathRewrite: {
    //       '^/api': ''
    //     },
    //     // 不能使用 localhost:8080 作为请求 GitHub 的主机名
    //     changeOrigin: true
    //   }
    // }
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024 // 10 KB
          }
        }
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(),
    // 用于生成index.html
    new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width'
      },
      template: './src/index.html'
    }),
    // 生成其他html，about.html
    // new HtmlWebpackPlugin({
    //   filename: 'about.html'
    // }), 
    // new CopyWebpackPlugin([
    //   'public'
    // ]),
    // new MyPlugin()
    new webpack.HotModuleReplacementPlugin()
  ]
}