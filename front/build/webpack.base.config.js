var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './src/main.js',
  output: {
    path: './dist',
    publicPath: '/dist/',
    filename: 'build.js'
  },
  resolve: {
      //自动扩展文件后缀名，意味着require模块可以省略不写后缀名
      extensions: ['', '.js', '.vue', '.scss'],
      //依赖文件，重命名，打包入文件
      alias : {
        'vue$': 'vue/dist/vue.common.js',
      }
  },
  externals : {
    'zepto' : 'Zepto',
    'swiper' : 'Swiper',
    'fastClick' : 'FastClick',
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel?presets=es2015',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        query: {
          limit: 12000,
          name: '[name].[ext]'
        }
      },
      { test: /\.scss$/, loader: 'style!css!sass'},
      {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          loader: "url",
          query: {
            name: '[name].[ext]?[hash]&mimetype=application/font-woff'
          }
      }
    ]
  },
  vue: {
        loaders: {
            css: ExtractTextPlugin.extract(
              "style-loader",
              "css-loader?sourceMap",
              {
                publicPath: "./dist/"
              }
            )
        }
  },
  plugins: [
      new ExtractTextPlugin("style.css")
  ],
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime']
  }
}
