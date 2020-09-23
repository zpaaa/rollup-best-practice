import postcss from 'rollup-plugin-postcss'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import template from 'rollup-plugin-generate-html-template'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
const path = require('path')
console.log(process.env.NODE_ENV)
const isDev = process.env.NODE_ENV === 'development'
export default {
  input: './entry.js',
  output: {
    file: './dist/index.js',
    format: 'esm'
  },
  plugins: [
    isDev ? null : terser(),
    getBabelOutputPlugin({
      "presets": [
        [
          '@babel/preset-env',
          {
            "targets": {
              "ie": "8"
            }
          }
        ]
      ]
    }),
    postcss({
      extract: true,
      extract: path.resolve('dist/index.css'),
      plugins: [
        require('autoprefixer'),
        require('rollup-plugin-scss'),
        require('postcss-url')([
          {
            filter: '**/src/images/*.png',
            url: 'inline',
            maxSize: 100,
          }
        ])
      ],
    }),
    template({
      template: './public/index.html',
      target: './dist/index.html',
      replaceVars: {
        '__STYLE_URL__': 'index.css'
      }
    }),
    isDev ? serve({
      open: false, // 是否打开浏览器
      contentBase: './dist', // 入口HTML 文件位置
      historyApiFallback: true, // Set to true to return index.html instead of 404
      host: 'localhost',
      port: 10001,
    }) : null,
    isDev ? livereload() : null
  ],
}