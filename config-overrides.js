const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
  addWebpackAlias,
  fixBabelImports
} = require("customize-cra");

const path = require('path')
const resolve = dir => path.join(__dirname, '.', dir)

module.exports = override(
  // enable legacy decorators babel plugin
  addDecoratorsLegacy(),
  addWebpackAlias({
    ['@']: resolve('src'),
    ['@pages']: resolve('src/pages'),
    ['@components']: resolve('src/components')
  }),
  fixBabelImports('import', {
   libraryName: 'antd',
   libraryDirectory: 'es',
    style: 'css'
  }),
  // disable eslint in webpack
  disableEsLint()
);