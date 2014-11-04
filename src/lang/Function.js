/**
 This file is core of xs.js 0.1

 Copyright (c) 2013-2014, Annium Inc

 Contact:  http://annium.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://annium.com/contact.

 */
/**
 * array class pre-definition
 * @type {}
 * @private
 */
'use strict';
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    var fn = xs.Function = new (function () {
        var functionPrototype = Function.prototype,
            slice = Function.prototype.call.bind(Array.prototype.slice),
            concat = Function.prototype.apply.bind(Array.prototype.concat);
        /**
         * binds function with scope and arguments
         * @param fn
         * @param scope
         * @param args
         * @returns {Function}
         */
        var _bind = this.bind = function (fn, scope, args) {
            return functionPrototype.bind.apply(fn, concat(scope, args));
        };
        /**
         * prefills function's arguments
         * @param fn
         * @param defaults
         * @param scope
         * @returns {Function}
         */
        this.prefill = function (fn, defaults, scope) {
            return function () {
                var args = xs.Array.defaults(xs.Array.values(arguments), defaults);
                return fn.apply(scope, args);
            }
        };
        /**
         * creates function, being called once
         * @param fn
         * @returns {Function}
         */
        this.once = function (fn) {
            var ran = false, memo;
            return function () {
                if (ran) return memo;
                ran = true;
                memo = fn.apply(this, arguments);
                fn = null;
                return memo;
            };
        };
        /**
         * wraps function within another function
         * @param fn
         * @param wrapper
         * @returns {Function}
         */
        this.wrap = function (fn, wrapper) {
            return function () {
                var args = slice(arguments);
                args.unshift(fn);
                return wrapper.apply(undefined, args);
            }
        };
        this.nextTick = function (fn, scope) {
            scope && (fn = _bind(fn, scope));
            setTimeout(fn, 0);
        }
    });
    xs.extend(xs, {
        bind: fn.bind,
        prefill: fn.prefill,
        once: fn.once,
        wrap: fn.wrap,
        nextTick: fn.nextTick
    });
})(window, 'xs');