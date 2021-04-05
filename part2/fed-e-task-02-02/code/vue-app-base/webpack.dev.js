const common = require('./webpack.common');
const merge = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  optimization: {
    usedExports: true,
    minimize: true
  },
  devtool: 'eval-cheap-module-source-map'
});
