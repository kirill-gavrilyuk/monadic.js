# monadic.js

Parser and Plugin for babel that provides haskell-like do-notation into javascript. 

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

`Monad` object, should contain, at least, two fields:
```
mbind   :: (ma, a -> mb) -> mb
mreturn :: a -> ma
```

Inside of doExpression's body block, you can use:
- `<-` operator (`a <- *expression*` is a **statement**)
- multiple `return` (`return` is an **expression**, and can be used where expression allowed)

**The last line can ONLY be an expression.**
 

For more details look here: [monadic.js-playground](https://github.com/kirill-gavrilyuk/monadic.js-playground)

Some (maybe) useful articles about monads:

- https://curiosity-driven.org/monads-in-javascript
- http://igstan.ro/posts/2011-05-02-understanding-monads-with-javascript.html
- https://en.wikipedia.org/wiki/Monad_(functional_programming)

