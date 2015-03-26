'use strict';

//define xs.core
if (!xs.core) {
    xs.core = {};
}

var log = new xs.log.Logger('xs.core.Lazy');

var assert = new xs.core.Asserter(log, XsCoreLazyError);

/**
 * xs.core.Lazy is key system element, that allows lazy-like evaluations for class members.
 *
 * xs.core.Lazy is used to evaluate value of class member when it will be needed (That decision is made by processors internally)
 *
 * Using xs.core.Lazy, for example, allows to define Class members using own Class imports
 *
 * xs.core.Lazy is used via xs.lazy helper, that returns xs.core.Lazy instance. To get instance value use it's get method.
 *
 * For example:
 *
 *     //define some sample class
 *     xs.Class(function() {
 *
 *         var Class = this;
 *
 *         //define constant via lazy
 *         Class.constant.name = xs.lazy(function() {
 *             return 'value';
 *         });
 *
 *     });
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.core.Lazy
 *
 *
 *
 * @constructor
 *
 * Lazy constructor. Accepts single argument - evaluation function
 *
 * For example:
 *
 *     //create lazy instance
 *     var lazy = new xs.core.Lazy(function() {
 *         return 'aaa';
 *     });
 *
 *     //get value of lazy
 *     var value = lazy.get();
 *
 * @param {Function} evaluation lazy post-evaluated value
 */
xs.core.Lazy = function (evaluation) {
    var me = this;

    //assert, that  evaluation is function
    assert.fn(evaluation, 'constructor - given evaluation `$evaluation` is not a function', {
        $evaluation: evaluation
    });

    /**
     * Returns value of xs.core.Lazy
     *
     * Attention, as far as value is fetched, method is removed!
     *
     * @method get
     *
     * @return {*} lazy evaluated value
     */
    me.get = function () {
        //delete get function
        delete me.get;

        //return evaluation value
        return evaluation();
    };
};


/**
 * Returns instance of xs.core.Lazy for given evaluation
 *
 * @member xs
 *
 * @method lazy
 *
 * @return {xs.core.Lazy} instance of xs.core.Lazy for given evaluation
 */
xs.lazy = function (evaluation) {
    return new xs.core.Lazy(evaluation);
};

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsCoreLazyError
 */
function XsCoreLazyError(message) {
    this.message = 'xs.core.Lazy::' + message;
}

XsCoreLazyError.prototype = new Error();

xs.apply(xs, {
    define: xs.ContractsManager.define
});