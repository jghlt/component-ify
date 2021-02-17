# component-ify

An opinionated component based workflow for building Shopify themes.

## Overview
Component-ify is an opinionated way of organizing front-end code in Shopify projects, based on single directory components, inspired by [Komponent](https://github.com/komposable/komponent).

Each component lives in a single directory which contains a liquid file, a scss file, an optional js file, a readme and an index.js entry point.

Component-ify is designed to be used in conjunction with [slate](https://github.com/Shopify/slate) and can be added into any existing slate project.

## Setup
To add component-ify to a new or existing slate project:
- copy `bin/scaffold.js` to project root
- copy `webpack/CopyLiquidFilesPlugin.js` to project root
- run `yarn add chokidar glob lodash --save`
- add `"scaffold": "./bin/scaffold.js"` to your npm scripts
- add webpack plugin to your slate config: 
```
// slate.config.js
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
```
- (optional/recommended) copy `src/scripts/app/ComponentifyView.js` to your scripts dir. This file can be extended within your layouts & templates if you would like to use the mount/unmount pattern for initializing your js components.
- (optional/recommended) add `src/snippets/*.liquid` to your .gitignore to ignore snippets. Snippets should now live in thier respective components dirs, but if this is an existing project it might not be possible to refactor all existing snippets. If this is the case, you might find you are commiting 2 files for each new component.

## Starter Theme
If you just want to get up and running with everything already in place, take a look at the [starter theme](https://github.com/jghlt/component-ify-shopify-starter).

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
  _hero.scss
  hero.liquid
  index.js
  readme.md
```

To generate a component with an associated js class run 

```
npm run scaffold hero js

will generate:
/src/components/hero
  _hero.scss
  hero.js
  hero.liquid
  index.js
  readme.md
```

## CopyLiquidFilesPlugin.js
`CopyLiquidFilesPlugin.js` is a simple webpack plugin that will copy all `[component].liquid` files to from the components directory to the snippets directory for use in shopify. Files will be copied when webpack is started and then watched for changes when they will be copied again. Once copied to the snippets directory, Slate will then take over and upload them as if they were an normal snippet.

You can add `CopyLiquidFilesPlugin.js` to the project by placing the `webpack/CopyLiquidFilesPlugin.js` script at the root of the project and then require and use like any webpack plugin. The plugin expects three options:

- `src`: the location of the components directory
- `dest`: the location of the snippets 
- `build`: build flag, need to pass this when running production build.
```
// slate.config.js
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
```
## Workflow
Component-ify is designed to be used in conjunction with [Slate](https://github.com/Shopify/slate), if you are unfamiliar with Slate and its workflow/concepts please read those [docs](https://github.com/Shopify/slate) first. 

To get an overview of the workflow lets examine the two example components in `src/components/`:
```
src/components
  hero/ 
    _hero.scss
    hero.js
    hero.liquid
    readme.md
    index.js
  promo-banner/
    _promo-banner.scss
    promo-banner.liquid
    readme.md
    index.js
```

To load these components globally we include them in `layout/theme.js`:
```
// src/scripts/layout/theme.js

import 'components/promo-banner';
import Hero from 'components/hero';
```

If you inspect the `index.js` for each component you will see how styles & js are imported/exported.

`promo-banner` does not have any component js so we just import the styles. 

```
// src/components/promo-banner/index.js

import './_promo-banner';
```

`hero` does have js so we need to import the exported js class along with the styles. 

```
// src/components/hero/index.js

import './_hero';
export { default } from "./hero";
```

With the components loaded into `theme.js` we can now `mount` the js components by extending `src/scripts/app/ComponentifyView.js`:

```
import Hero from 'components/hero';

class Theme extends ComponentifyView {
  constructor() {
    super();
    this.dom = {
      $html: document.querySelector('html')
    }
    this.state = {
      components: {
        Hero
      },
      mounted: []
    };
    this.mount();
  }

  mount() {
    const {
      dom,
      state
    } = this;
    this.mountComponents();
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  new Theme();
});
```

## Notes
- It's probably best practice to move all snippets to component directories so the "compiled" snippets can be added to the gitignore and you don't have to commit 2 versions of the same file
```
// .gitignore

# Component-ify #
######################
src/snippets/*.liquid
```

- To use Sass features (mixins, etc) in component scss files, you'll need to add the `sass-resources-loader` plugin to your dev dependencies, set up a resources file that includes all the files you want to include, and configure Webpack to use the plugin with the specified resources file

```
// package.json

"devDependencies": {
    "sass-resources-loader": "^2.0.1"
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

module.exports = {
  'webpack.extend': {
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
    }
  },
};
```

## License

MIT
