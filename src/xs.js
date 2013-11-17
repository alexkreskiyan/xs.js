(function (ns) {

    // initial setup
    // -------------

    // Save a reference to the global object (`window` in the browser, `exports`
    // on the server).
    var root = this;

    // Save the previous value of the `xs` variable, so that it can be
    // restored later on, if `noConflict` is used.
    var previousXs = root[ns] || root.xs;

    // The top-level namespace. All public classes and modules will
    // be attached to this. Exported for both the browser and the server.
    var xs = {};
    // Export the xs object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = xs;
        }
        exports[ns] = xs;
    } else {
        root[ns] = xs;
    }

    // Current version of the library. Keep in sync with `package.json`.
    xs.VERSION = '0.1.0';

    // Require Underscore, if we're on the server, and it's not already present.
    var _ = root._;
    if (!_ && (typeof require === 'function'))
        _ = require('underscore');

    // For xs's purposes, jQuery, Zepto or Ender owns
    // the `$` variable.
    xs.$ = root.jQuery || root.Zepto || root.ender || root.$;

    // For xs's purposes, underscore is saved in variable.
    xs._ = _;

    // Runs xs.js in *noConflict* mode, returning the `xs` variable
    // to its previous owner. Returns a reference to this xs object.
    xs.noConflict = function () {
        root[ns] = previousXs || xs;
        return this;
    };
}).call(this, 'xs');