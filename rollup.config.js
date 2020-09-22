import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import scss from 'rollup-plugin-scss'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import template from 'rollup-plugin-generate-html-template'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
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
    scss(),
    postcss({
      extract: true,
      extract: path.resolve('dist/index.css'),
      plugins: [
        autoprefixer(),
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