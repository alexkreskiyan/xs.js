/*!
 This file is core of xs.js

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
 * @class xs.lang.Function
 * @singleton
 * @private
 *
 * xs.lang.Function is private singleton, defining basic function operations.
 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    var fn = new (function () {
        var me = this;

        var functionPrototype = Function.prototype;
        var slice = Function.prototype.call.bind(Array.prototype.slice);
        var concatenate = Function.prototype.apply.bind(Array.prototype.concat);

        /**
         * Binds function with scope and arguments
         *
         * For example:
         *
         *     var fn = function (a, b, c) {
         *         return this.x + (a - b) * c;
         *     };
         *     var bind = xs.bind(fn, {x: 5}, [2, 3]);
         *     console.log(bind(4));//1
         *
         * @method bind
         *
         * @param {Function} fn bound function
         * @param {Object} scope optional execution scope
         * @param {Array} args optional additional arguments, prepended to function
         *
         * @returns {Function} bound function
         */
        var _bind = me.bind = function (fn, scope, args) {
            return functionPrototype.bind.apply(fn, concatenate(scope, args));
        };

        /**
         * Prefills function's arguments
         *
         * For example:
         *
         *     var fn = function (a, b, c) {
         *         return this.x + (a - b) * c;
         *     };
         *     var filled = xs.prefill(fn, [1, 2, 3], {x: 5});
         *     console.log(filled(4));//11
         *
         * @method prefill
         *
         * @param {Function} fn bound function
         * @param {Array} defaults predefined params' defaults
         * @param {Object} scope optional execution scope
         *
         * @returns {Function} bound function
         */
        me.prefill = function (fn, defaults, scope) {
            return function () {
                var args = xs.values(arguments);
                xs.defaults(args, defaults);
                return fn.apply(scope, args);
            }
        };

        /**
         * Creates function, that is executed only once
         *
         * For example:
         *
         *     var fn = function (obj) {
         *         obj.x++;
         *     };
         *     var obj = {x: 1};
         *     var one = xs.once(fn);
         *     one(obj);
         *     console.log(obj.x); //2
         *     one(obj);
         *     console.log(obj.x); //2
         *
         * @method once
         *
         * @param {Function} fn bound function
         *
         * @returns {Function} bound function
         */
        me.once = function (fn) {
            var ran = false, memo;
            return function () {
                if (ran) {
                    return memo;
                }
                ran = true;
                memo = fn.apply(this, arguments);
                fn = null;
                return memo;
            };
        };

        /**
         * Wraps function within another function
         *
         * For example:
         *
         *     var fn = function (val) {
         *         return 2 * val;
         *     };
         *     var wrapped = xs.wrap(fn, function (func, a, b, c) {
         *         return a + func(b) + c;
         *     });
         *     console.log(wrapped(1, 2, 3)); //8
         *
         * @method wrap
         *
         * @param {Function} fn wrapped function
         * @param {Function} wrapper wrapper function
         * @param {Object} scope optional execution scope
         *
         * @returns {Function} wrapped function
         */
        me.wrap = function (fn, wrapper, scope) {
            return function () {
                var args = slice(arguments);
                args.unshift(fn);
                return wrapper.apply(scope, args);
            }
        };

        /**
         * Executes given function on next tick
         *
         * For example:
         *
         *     xs.nextTick(function(){
         *         console.log(this);
         *     }, {x: 1});
         *     //outputs:
         *     //{
         *     //    x: 1
         *     //}
         *
         * @method nextTick
         *
         * @param fn
         * @param scope
         */
        me.nextTick = function (fn, scope) {
            scope && (fn = _bind(fn, scope));
            setTimeout(fn, 0);
        }

        /**
         * @ignore
         *
         * Represents empty function. is used internally
         */
        me.emptyFn = function () {
        };
    });
    xs.extend(xs, fn);
})(window, 'xs');