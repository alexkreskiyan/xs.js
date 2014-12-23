/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    /**
     * xs.lang.Function is private singleton, defining basic function operations.
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @private
     *
     * @class xs.lang.Function
     *
     * @singleton
     */
    var fn = xs.Function = new (function () {
        var me = this;

        var _bindFunction = Function.prototype.bind;
        var _slice = Function.prototype.apply.bind(Array.prototype.slice);
        var _concatenate = Function.prototype.apply.bind(Array.prototype.concat);

        /**
         * Creates binded function, that will be called with given scope and optional args, prepended to call arguments
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
         * @param {Array} [args] optional additional arguments, prepended to function
         *
         * @return {Function} bound function
         */
        var _bind = me.bind = function (fn, scope, args) {
            return _bindFunction.apply(fn, _concatenate(scope, args));
        };

        /**
         * Creates function, that is executed only once. Result is memorized and is simply returned in later calls
         *
         * For example:
         *
         *     var fn = function (obj) {
         *         obj.x++;
         *     };
         *     var obj = {x: 1};
         *     var one = xs.memorize(fn);
         *     one(obj);
         *     console.log(obj.x); //2
         *     one(obj);
         *     console.log(obj.x); //2
         *
         * @method memorize
         *
         * @param {Function} fn bound function
         *
         * @return {Function} bound function
         */
        me.memorize = function (fn) {
            var ran = false, memo;

            return function () {
                //return saved result if already ran
                if (ran) {

                    return memo;
                }

                //mark, that function was run
                ran = true;

                //save result
                memo = fn.apply(this, arguments);

                //remove reference to fn
                fn = null;

                //return result
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
         * @return {Function} wrapped function
         */
        me.wrap = function (fn, wrapper, scope) {

            return function () {
                var args = _slice(arguments);
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
         * @param {Function} fn executed function
         * @param {Object} scope optional execution scope
         */
        me.nextTick = function (fn, scope) {
            scope && (fn = _bind(fn, scope));
            setTimeout(fn, 0);
        };

        var getNameRe = /^function\s*([A-z_0-9]*)/i;
        /**
         * Fetches name from function
         *
         * For example:
         *
         *     console.log(xs.Function.getName(function(){
         *         console.log(this);
         *     }); // ''
         *     console.log(xs.Function.getName(function demo (){
         *         console.log(this);
         *     }); // 'demo'
         *
         * @method getName
         *
         * @param {Function} fn parsed function
         *
         * @return {String} function name
         */
        me.getName = function (fn) {
            getNameRe.lastIndex = 0;
            return getNameRe.exec(fn.toString()).pop();
        };

        var getArgumentsRe = /^function\s*[A-z_0-9]*\s*\(([A-z_0-9\s,]*)\)/i;
        /**
         * Fetches arguments list from function
         *
         * For example:
         *
         *     console.log(xs.Function.getArguments(function(){
         *         console.log(this);
         *     }); // []
         *     console.log(xs.Function.getArguments(function (a,b,e){
         *         console.log(this);
         *     }); // ['a','b','e']
         *
         * @method getArguments
         *
         * @param {Function} fn parsed function
         *
         * @return {Array} array with function formal params
         */
        me.getArguments = function (fn) {
            getArgumentsRe.lastIndex = 0;
            return xs.compact(xs.map(getArgumentsRe.exec(fn.toString()).pop().split(','), function (name) {
                return name.trim();
            }));
        };

        /**
         * Fetches function body
         *
         * For example:
         *
         *     console.log(xs.Function.getBody(function(){
         *         console.log(this);
         *     }); // 'console.log(this);'
         *     console.log(xs.Function.getBody(function (a,b,e){}); // ''
         *
         * @method getBody
         *
         * @param {Function} fn parsed function
         *
         * @return {String} function body
         */
        me.getBody = function (fn) {
            var stringFn = fn.toString();
            return stringFn.substring(stringFn.indexOf('{') + 1, stringFn.length - 1);
        };

        var parseRe = /^function\s*([A-z_0-9]*)\s*\(([A-z_0-9\s,]*)\)/i;
        /**
         * Fetches function name, arguments and body
         *
         * For example:
         *
         *     console.log(xs.Function.parse(function asd(a,b){
         *         console.log(this);
         *     }); // {name:'asd', arguments: ['a','b'], body: 'console.log(this);' }
         *
         * @method parse
         *
         * @param {Function} fn parsed function
         *
         * @return {Object} function data
         */
        me.parse = function (fn) {
            parseRe.lastIndex = 0;
            var stringFn = fn.toString();
            var data = parseRe.exec(stringFn);
            return {
                name: data[1],
                arguments: xs.compact(xs.map(data[2].split(','), function (name) {
                    return name.trim();
                })),
                body: stringFn.substring(stringFn.indexOf('{') + 1, stringFn.length - 1)
            };
        };

        /**
         * @ignore
         *
         * Represents empty function. is used internally
         */
        me.emptyFn = function () {
        };
    });

    xs.extend(xs, xs.pick(fn, [
        'bind',
        'prefill',
        'memorize',
        'wrap',
        'nextTick',
        'emptyFn'
    ]));
})(window, 'xs');