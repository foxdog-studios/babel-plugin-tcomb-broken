babel-plugin-tcomb broken
=========================

The `babel-plugin-tcomb` Babel plugin does not function correctly with Meteor
core package `ecmascript` after version `0.6.1`.


Setup
-----

    $ cd /path/to/app
    $ meteor npm install
    $ meteor


Background
----------

We use `flow`, `tcomb`, and `babel-plugin-tcomb` for static and runtime
type-checking, respectively. In this example project, the `echo` function
in `main.js` should only be passed `foo1` or `foo2`, as described by `FooType`
in `FooType.js`. The second call to `echo` passes an illegal argument, `bar1`
and we expect a `tcomb` generated `TypeError`.


Details
-------

In this example project, the `ecmascript` packages is pinned to `0.6.1`. Under
this version, the following code is generated for the `FooType.js` module.

    module.export({
        FooType: function () {
            return FooType
        }
    });

    var _t; module.import('tcomb', {
        "default": function (v) { _t = v }
    });

    var FooType = _t.enums.of(['foo1', 'foo2'], 'FooType');

This code correctly exports `tcomb`'s type checker for `FooType` and the misuse
of the `echo` function in `main.js` is correctly detected:

    TypeError: [tcomb] Invalid value "bar1" supplied to foo: FooType (expected one of [
      "foo1",
      "foo2"
    ])

Updating the `ecmascript` package to version `0.6.2` creates the following code:

    import _t from "tcomb";

    var FooType = _t.enums.of(["foo1", "foo2"], "FooType");

Which causes a syntax error:

    import _t from "tcomb";
    ^^^^^^

    SyntaxError: Unexpected reserved word
        at Object.exports.runInThisContext (vm.js:53:16)

Adding `babel-plugin-transform-es2015-modules-commonjs` doesn't help:

    $ meteor npm install --save-dev babel-plugin-transform-es2015-modules-commonjs

    $ cat .babelrc
    {
      "plugins": [
        "tcomb",
        "transform-es2015-modules-commonjs"
      ]
    }

`FooType` is not exported:

    "use strict";
    var _tcomb = require("tcomb");
    var _tcomb2 = _interopRequireDefault(_tcomb);
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
    var FooType = _tcomb2.default.enums.of(["foo1", "foo2"], "FooType");


Question
---------

Is there a fix for this issue or are we stuck with ecmascript@=0.6.1 (and
therefore release `1.4.2.7`)?


Thanks,


Peter.
