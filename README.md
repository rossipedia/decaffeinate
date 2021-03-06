# decaffeinate [![Build Status](https://travis-ci.org/decaffeinate/decaffeinate.svg?branch=master)](https://travis-ci.org/decaffeinate/decaffeinate) [![npm](https://img.shields.io/npm/v/decaffeinate.svg)](https://www.npmjs.com/package/decaffeinate) [![Greenkeeper badge](https://badges.greenkeeper.io/decaffeinate/decaffeinate.svg)](https://greenkeeper.io/)

Goodbye CoffeeScript, hello JavaScript!

JavaScript is the future, in part thanks to CoffeeScript. Now that it has served
its purpose, it's time to move on. Convert your CoffeeScript source to modern
JavaScript with decaffeinate.

## Installation and usage

```
$ npm install -g decaffeinate
$ decaffeinate input.coffee
input.coffee → input.js
```

Alternatively, paste code into the online [repl] to immediately see the output.

For real-world use cases, you'll likely want to spend some time understanding
the different options and nuances of the decaffeinate tool. You'll also likely
want to run decaffeinate using the [bulk-decaffeinate] wrapper tool, or write
your own wrapper script. See the [Conversion Guide][conversion-guide] for more
information and advice on running decaffeinate on real-world code.

## Status

**Mostly complete.** The project has been used to convert tens of thousands of
lines of production code, and can be relied upon for production use, but no
guarantees are made.

Here are some popular open source CoffeeScript projects and their current status
when run through decaffeinate. Each project has a decaffeinate-specific fork
that is re-run daily.

Project        | Lines of CoffeeScript | Conversion status                 | Test status
-------------- |:---------------------:|:---------------------------------:|:---------------------------:
[chroma.js]    | 3.3K                  | ![chromajs-conversion-status]     | ![chromajs-test-status]
[hubot]        | 3.7K                  | ![hubot-conversion-status]        | ![hubot-test-status]
[autoprefixer] | 4.8K                  | ![autoprefixer-conversion-status] | ![autoprefixer-test-status]
[coffeelint]   | 8.8K                  | ![coffeelint-conversion-status]   | ![coffeelint-test-status]
[vimium]       | 11K                   | ![vimium-conversion-status]       | ![vimium-test-status]
[coffeescript] | 17K                   | ![coffeescript-conversion-status] | ![coffeescript-test-status]
[atom]         | 51K                   | ![atom-conversion-status]         | ![atom-test-status]
[atom-org]     | 170K                  | ![atom-org-conversion-status]     | ![atom-org-test-status]
[codecombat]   | 230K                  | ![codecombat-conversion-status]   | ![codecombat-test-status]

**Project builder status:** [![Build Status](https://travis-ci.org/decaffeinate/decaffeinate-example-builder.svg?branch=master)](https://travis-ci.org/decaffeinate/decaffeinate-example-builder)

To contribute to this list, send a pull request to the [decaffeinate-examples]
project.

In addition, decaffeinate has been used on private codebases within various
companies, such as Square, Benchling, and Bugsnag. See this
[blog post from Bugsnag][bugsnag-blog-post] to read about their experiences
using decaffeinate.

Check the [issues] page for more specific details on outstanding bugs and
incomplete features. And, of course, you're welcome to file issues for any
problems you run into.

[chroma.js]: https://github.com/decaffeinate-examples/chroma.js
[hubot]: https://github.com/decaffeinate-examples/hubot
[autoprefixer]: https://github.com/decaffeinate-examples/autoprefixer
[coffeelint]: https://github.com/decaffeinate-examples/coffeelint
[vimium]: https://github.com/decaffeinate-examples/vimium
[coffeescript]: https://github.com/decaffeinate-examples/coffeescript
[atom]: https://github.com/decaffeinate-examples/atom
[atom-org]: https://github.com/decaffeinate-examples/atom-org
[codecombat]: https://github.com/decaffeinate-examples/codecombat

[decaffeinate-examples]: https://github.com/decaffeinate/decaffeinate-examples

[chromajs-conversion-status]: https://decaffeinate-examples.github.io/chroma.js/conversion-status.svg
[chromajs-test-status]: https://decaffeinate-examples.github.io/chroma.js/test-status.svg
[hubot-conversion-status]: https://decaffeinate-examples.github.io/hubot/conversion-status.svg
[hubot-test-status]: https://decaffeinate-examples.github.io/hubot/test-status.svg
[autoprefixer-conversion-status]: https://decaffeinate-examples.github.io/autoprefixer/conversion-status.svg
[autoprefixer-test-status]: https://decaffeinate-examples.github.io/autoprefixer/test-status.svg
[coffeelint-conversion-status]: https://decaffeinate-examples.github.io/coffeelint/conversion-status.svg
[coffeelint-test-status]: https://decaffeinate-examples.github.io/coffeelint/test-status.svg
[vimium-conversion-status]: https://decaffeinate-examples.github.io/vimium/conversion-status.svg
[vimium-test-status]: https://decaffeinate-examples.github.io/vimium/test-status.svg
[coffeescript-conversion-status]: https://decaffeinate-examples.github.io/coffeescript/conversion-status.svg
[coffeescript-test-status]: https://decaffeinate-examples.github.io/coffeescript/test-status.svg
[atom-conversion-status]: https://decaffeinate-examples.github.io/atom/conversion-status.svg
[atom-test-status]: https://decaffeinate-examples.github.io/atom/test-status.svg
[atom-org-conversion-status]: https://decaffeinate-examples.github.io/atom-org/conversion-status.svg
[atom-org-test-status]: https://decaffeinate-examples.github.io/atom-org/test-status.svg
[codecombat-conversion-status]: https://decaffeinate-examples.github.io/codecombat/conversion-status.svg
[codecombat-test-status]: https://decaffeinate-examples.github.io/codecombat/test-status.svg

[bugsnag-blog-post]: https://blog.bugsnag.com/converting-a-large-react-codebase-from-coffeescript-to-es6/

## Goals

* Fully automated conversion of the CoffeeScript language to modern JavaScript.
* Preserve whitespace, formatting, and comments as much as possible to allow
  a full one-time conversion of your CoffeeScript source code.
* Focus on correctness as the first priority, with some options to generate
  nicer code at the expense of 100% correctness.
* Provide helpful error messages when it encounters an unsupported language
  construct.

## Options

* `--literate`: Treat the input file as Literate CoffeeScript.
* `--keep-commonjs`: Do not convert `require` and `module.exports` to `import`
  and `export`.
* `--force-default-export`: When converting to `export`, use a single
  `export default` rather than trying to generate named imports where possible.
* `--safe-import-function-identifiers`: Comma-separated list of function names
  that may safely be in the `import`/`require` section of the file. All other
  function calls will disqualify later `require`s from being converted to
  `import`s.
* `--prefer-const`: Use `const` when possible in output code.
* `--loose-default-params`: Convert CS default params to JS default params.
* `--loose-for-expressions`: Do not wrap expression loop targets in `Array.from`.
* `--loose-for-of`: Do not wrap JS `for...of` loop targets in `Array.from`.
* `--loose-includes`: Do not wrap in `Array.from` when converting `in` to `includes`.
* `--loose-comparison-negation`: Allow unsafe simplifications like `!(a > b)` to `a <= b`.
* `--allow-invalid-constructors`: Don't error when constructors use `this`
  before super or omit the `super` call in a subclass.
* `--enable-babel-constructor-workaround`: Use a hacky Babel-specific workaround
  to allow `this` before `super` in constructors. Also works when using
  TypeScript.

For more usage details, see the output of `decaffeinate --help`.

[repl]: http://decaffeinate-project.org/repl/
[bulk-decaffeinate]: https://github.com/decaffeinate/bulk-decaffeinate
[issues]: https://github.com/decaffeinate/decaffeinate/issues
[conversion-guide]: https://github.com/decaffeinate/decaffeinate/blob/master/docs/conversion-guide.md
