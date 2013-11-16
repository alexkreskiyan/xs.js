(function () {

    // Initial Setxs
    // -------------

    // Save a reference to the global object (`window` in the browser, `exports`
    // on the server).
    var root = this;

    // Save the previous value of the `xs` variable, so that it can be
    // restored later on, if `noConflict` is used.
    var previousXs = root.xs;

    // Create local references to array methods we'll want to use later.
    var array = [];
    var push = array.push;
    var slice = array.slice;
    var splice = array.splice;
    // The top-level namespace. All public xs classes and modules will
    // be attached to this. Exported for both the browser and the server.
    var xs = function (obj) {
        if (obj instanceof xs)
            return obj;
        if (!(this instanceof xs))
            return new xs(obj);
    };
    // Export the xs object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = xs;
        }
        exports.xs = xs;
    } else {
        root.xs = xs;
    }

    // Current version of the library. Keep in sync with `package.json`.
    xs.VERSION = '0.1.0';

    // Require Underscore, if we're on the server, and it's not already present.
    var _ = root._;
    if (!_ && (typeof require !== 'undefined'))
        _ = require('underscore');

    // For xs's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
    // the `$` variable.
    xs.$ = root.jQuery || root.Zepto || root.ender || root.$;

    // For xs's purposes, underscore is saved in variable.
    xs._ = _;

    // Runs xs.js in *noConflict* mode, returning the `xs` variable
    // to its previous owner. Returns a reference to this xs object.
    xs.noConflict = function () {
        root.xs = previousXs;
        return this;
    };

    //define extend function
    xs.extend = function (child, parent) {
        var f = new Function();
        f.prototype = parent.prototype;
        child.prototype = new f();
        child.prototype.constructor = child;
        child.super = parent.prototype;
        return this;
    };
    //define mixin function
    xs.mixin = function (tgt) {
        var obj = {}, args = slice.call(arguments, 1), k, src, x;
        for (k in args) {
            src = args[k];
            for (x in args[k]) {
                ((typeof obj[x] !== "undefined") && (obj[x] === src[x])) || (tgt[x] = src[x]);
            }
        }
        return this;
    };
}).call(this);