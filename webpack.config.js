const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    index: [
      path.join(__dirname, './test.js'),
      path.join(__dirname, './test.html'),
    ],
  },

  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/',
  },

  resolve: {
    alias: {
      tape: 'browser-tap',
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [],
      },

      {
        test: [/\.html$/],
        use: [
          {
            loader: 'file-loader',
            options: { name: 'index.html' },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.TURTLEQUEUE_USER_TOKEN': `"${process.env.TURTLEQUEUE_USER_TOKEN}"`,
      'process.env.TURTLEQUEUE_API_KEY': `"${process.env.TURTLEQUEUE_API_KEY}"`,
      'process.env.TURTLEQUEUE_HOST': `"${process.env.TURTLEQUEUE_HOST}"`,
      'process.env.TURTLEQUEUE_TYPE': `"${process.env.TURTLEQUEUE_TYPE}"`,
      'process.env.TURTLEQUEUE_PROTOCOL': `"${process.env.TURTLEQUEUE_PROTOCOL}"`
    }),
  ],

  devtool: false,
}
