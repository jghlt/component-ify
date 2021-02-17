const CopyLiquidFilesPlugin = require('./webpack/CopyLiquidFilesPlugin');

module.exports = {
  'webpack.extend': {
    plugins: [
      new CopyLiquidFilesPlugin({
        src: './src/components/**/*.liquid',
        dest: './src/snippets/',
        build: (process.env.NODE_ENV === 'production')
      })
    ]
  },
};
