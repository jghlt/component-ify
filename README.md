# component-ify

An opinionated component based workflow for building Shopify themes.

## Overview
Component-ify is an opinionated way of organizing front-end code in Shopify projects, based on single directory components, inspired by the [Komponent](https://github.com/komposable/komponent).

Each component lives in a single directory which contains a liquid file, a scss file, an optional js file, a readme and an index.js entry point.

Component-ify is designed to be used in conjunction with [slate](https://github.com/Shopify/slate) and can be added into any existing slate project.

## Setup
Component-ify consists of two main files `bin/scaffold.js` and `webpack/CopyLiquidFilesPlugin.js`.

## scaffold.js
Scaffold is a simple node.js script that will scaffold a component directory and all the necessary files.

You can add scaffold to the project by placing the `bin/scaffold.js` script at the root of the project and then add an alias to the script in npm scripts:

```
"scripts": {
	"start": "slate-tools start",
	"watch": "slate-tools start --skipFirstDeploy",
	"build": "slate-tools build",
	"scaffold": "./bin/scaffold.js"
}
```

You can then generate components by running: 

```
npm run scaffold hero

will generate:
/src/components/hero
	hero.liquid
	hero.scss
	readme.md
	index.js

```

To generate a component with an associated js class run 

```
npm run scaffold hero js

will generate:
/src/components/hero
	hero.liquid
	hero.scss
	hero.js
	readme.md
	index.js
```

## CopyLiquidFilesPlugin.js
CopyLiquidFilesPlugin.js is a simple webpack plugin that will copy all `[component].liquid` files to from the components directory to the snippets directory for use in shopify. Files will be copied when webpack is started and then watched for changes when they will be copied again. Once copied to the snippets directory, Slate will then take over and upload them as if they were an normal snippet.

You can add `CopyLiquidFilesPlugin.js` to the project by placing the `webpack/CopyLiquidFilesPlugin.js` script at the root of the project and then require and use like any webpack plugin. The plugin expects three options:

```
// slate.config.js
const CopyLiquidFilesPlugin = require('./webpack/CopyLiquidFilesPlugin');

const custom = {
  plugins: [
    new CopyLiquidFilesPlugin({
      src: './src/components/**/*.liquid',
      dest: './src/snippets/',
      build: (process.env.NODE_ENV === 'production')
    })
  ]
};

module.exports = {
  'webpack.extend': config => {
    return custom
  }
};
```

## Workflow

## Notes
- It's probably best practice to move all snippets to component directories so the "compiled" snippets can be added to the gitignore and you don't have to commit 2 versions of the same file
```
// .gitignore
...
src/snippets/*.liquid
```

- To use Sass features (mixins, etc) in component scss files, you'll need to add the `sass-resources-loader` plugin to your dev dependencies, set up a resources file that includes all the files you want to include, and configure Webpack to use the plugin with the specified resources file

```
"devDependencies": {
    ...
    "sass-resources-loader": "^2.0.1"
    ...
  },
```
```
// styles/sass-resources.scss

@import './variables';
@import './tools/mixins';
@import './tools/functions';
```
```
// slate.config.js

const customWebpackConfig = {
  ...

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'sass-resources-loader',
            options: {
              resources: path.resolve(__dirname, 'src/styles/sass-resources.scss')
            }
          }
        ]
      }
    ]
  },

  ...
}
```


## License

MIT
