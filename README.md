# monadic.js

Parser and Plugin for babel that provides haskell-like do-notation into javascript.

Should work with babel6

## Setup

- Install monadic.js:

```bash
npm install --save-dev monadic.js
```

- Add plugin to babel's plugins list, and set monadic.js parser as babel's parser:

Part of webpack config (as an example):

```javascript
//...
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: [ "es2015", "stage-0" ],
                    plugins: [ "monadic.js/dist/plugin.js" ],
                    parserOpts: {
                        parser: "monadic.js/dist/parser.js"
                    }
                }
            }
        ]
//...
```

## Usage

In progress... Stay tuned... 

You can take a look at, first: 
https://github.com/kirill-gavrilyuk/Scratch2/blob/master/src/app/main.js


Some (maybe) useful articles about monads:

- https://curiosity-driven.org/monads-in-javascript
- http://igstan.ro/posts/2011-05-02-understanding-monads-with-javascript.html
- https://en.wikipedia.org/wiki/Monad_(functional_programming)

