'use strict';

var log = new xs.log.Logger('xs.interface.Interface');

var assert = new xs.core.Asserter(log, XsLangFunctionError);

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
xs.Function = (function () {
    var me = {};

    var bindFunction = Function.prototype.bind;
    var slice = Function.prototype.apply.bind(Array.prototype.slice);
    var concatenate = Function.prototype.apply.bind(Array.prototype.concat);

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
    var bind = me.bind = function (fn, scope, args) {
        assert.fn(fn, 'bind - given `$fn` is not a function', {
            $fn: fn
        });

        assert.ok(arguments.length < 3 || xs.isArray(args), 'bind - given `$args` is not a array', {
            $args: args
        });

        return bindFunction.apply(fn, concatenate(scope, args));
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
        assert.fn(fn, 'memorize - given `$fn` is not a function', {
            $fn: fn
        });

        var ran = false;
        var memo;

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
        assert.fn(fn, 'wrap - given `$fn` is not a function', {
            $fn: fn
        });

        assert.fn(wrapper, 'wrap - given `$fn` is not a function', {
            $fn: wrapper
        });

        return function () {
            var args = slice(arguments);
            args.unshift(fn);

            return wrapper.apply(scope, args);
        };
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
        assert.fn(fn, 'nextTick - given `$fn` is not a function', {
            $fn: fn
        });

        if (scope) {
            fn = bind(fn, scope);
        }

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
        assert.fn(fn, 'getName - given `$fn` is not a function', {
            $fn: fn
        });

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
        assert.fn(fn, 'getArguments - given `$fn` is not a function', {
            $fn: fn
        });

        getArgumentsRe.lastIndex = 0;

        return getArgumentsRe.exec(fn.toString()).pop().split(',').map(function (name) {

            return name.trim();
        }).filter(function (value) {

            return value;
        });
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
        assert.fn(fn, 'getBody - given `$fn` is not a function', {
            $fn: fn
        });

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
        assert.fn(fn, 'parse - given `$fn` is not a function', {
            $fn: fn
        });

        parseRe.lastIndex = 0;
        var stringFn = fn.toString();
        var data = parseRe.exec(stringFn);

        return {
            name: data[ 1 ],
            args: data[ 2 ].split(',').map(function (name) {

                return name.trim();
            }).filter(function (value) {

                return value;
            }),
            body: stringFn.substring(stringFn.indexOf('{') + 1, stringFn.length - 1)
        };
    };

    /**
     * Represents empty function. Is used internally to specify empty methods
     *
     * @method noop
     */
    me.noop = function () {
    };

    return me;
})();

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsLangFunctionError
 */
function XsLangFunctionError(message) {
    this.message = 'xs.lang.Function::' + message;
}

XsLangFunctionError.prototype = new Error();

xs.bind = xs.Function.bind;
xs.memorize = xs.Function.memorize;
xs.wrap = xs.Function.wrap;
xs.nextTick = xs.Function.nextTick;
xs.noop = xs.Function.noop;