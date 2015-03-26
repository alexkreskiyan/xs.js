/**
 * Implementation of Futures & Promises pattern for xs.js.
 *
 * Usage example:
 *
 *     var getData = function() {
 *         var promise = new xs.ux.Promise();
 *         setTimeout(function() {
 *             promise.resolve({x: 1});
 *         }, 500);
 *         return promise;
 *     };
 *
 *     getData().then(function(data) {
 *         console.log('data fetched', data);
 *
 *         //transform data
 *         data.message = data.x;
 *         data.x = null;
 *
 *         return data;
 *     }).then(function(data) {
 *         console.log('transformed data:', data);
 *         console.log('load update');
 *         //perform new async stage
 *         return getData().then(function(update) {
 *             console.log('update loaded');
 *             xs.apply(data, update);
 *
 *             return data;
 *         });
 *     }).then(function(data) {
 *         //log result
 *         console.log('Processing finished. Data:', data);
 *     });
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.ux.Promise
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Promise', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.ux';

    /**
     * Promise `pending` state constant
     *
     * @static
     *
     * @property Pending
     *
     * @readonly
     *
     * @type {Number}
     */
    Class.constant.Pending = xs.core.Promise.Pending;

    /**
     * Promise `resolved` state constant
     *
     * @static
     *
     * @property Resolved
     *
     * @readonly
     *
     * @type {Number}
     */
    Class.constant.Resolved = xs.core.Promise.Resolved;

    /**
     * Promise `rejected` state constant
     *
     * @static
     *
     * @property Rejected
     *
     * @readonly
     *
     * @type {Number}
     */
    Class.constant.Rejected = xs.core.Promise.Rejected;

    /**
     * Static method, that verifies given object to be a promise
     *
     * @static
     *
     * @method isPromise
     *
     * @return {Boolean} verification status
     */
    Class.static.method.isPromise = xs.core.Promise.isPromise;

    /**
     * Static async control operating method. Creates aggregate promise, that is resolved when all
     * given promises are resolved. If any promise among given is rejected, aggregate promise is rejected with that reason
     *
     * @method all
     *
     * @param {xs.ux.Promise[]} promises array of promises
     *
     * @return {xs.ux.Promise} aggregate promise
     */
    Class.static.method.all = xs.core.Promise.all;

    /**
     * Static async control operating method. Creates aggregate promise, that is resolved when some (count is specified by second param)
     * of given promises are resolved. If any promise among given is rejected, aggregate promise is rejected with that reason
     *
     * @method some
     *
     * @param {xs.ux.Promise[]} promises array of promises
     * @param {Number} count count of promises, needed for aggregate promise to resolve
     *
     * @return {xs.ux.Promise} aggregate promise
     */
    Class.static.method.some = xs.core.Promise.some;

    /**
     * Promise state. Is changed internally from {@link #Pending pending} to {@link #Resolved resolved} or {@link #Rejected rejected}
     *
     * @property state
     *
     * @readonly
     *
     * @type {String}
     */
    Class.property.state = {
        set: xs.noop
    };

    /**
     * Promise constructor
     *
     * @constructor
     */
    Class.constructor = function () {
        var me = this;

        //initially - Pending state
        me.private.state = self.Pending;

        //create handlers collection
        me.private.handlers = new xs.core.Collection();
    };

    /**
     * Promise resolve method. Resolves promise, running consequently it's handlers
     *
     * @method resolve
     *
     * @param {*} data data, promise is resolved with
     */
    Class.method.resolve = xs.core.Promise.prototype.resolve;

    /**
     * Promise reject method. Rejects promise, running consequently it's handlers
     *
     * @method reject
     *
     * @param {*} reason reason, for which promise is rejected
     */
    Class.method.reject = xs.core.Promise.prototype.reject;

    /**
     * Promise update method. Doesn't change promise state, only consequently runs all registered progress handlers.
     * So, this method could be run many times before promise is resolved or rejected. After that, update method is prohibited
     *
     * @method update
     *
     * @param {*} state some value, that means updated state of pending operation, handled by promise
     */
    Class.method.update = xs.core.Promise.prototype.update;

    /**
     * Core promise method. Adds handlers for promise future state, when it will be either resolved or rejected.
     * If no handlers given, method does nothing. If any handler given, new promise object will be returned, constructing
     * chain of promise objects, allowing to perform stack of async operations
     *
     * @method then
     *
     * @param {Function|undefined} [handleResolved] handler, that will be called, when promise will be resolved. Undefined, if param is omitted
     * @param {Function|undefined} [handleRejected] handler, that will be called, when promise will be rejected. Undefined, if param is omitted
     * @param {Function|undefined} [handleProgress] handler, that will be called, when promise will change it's progress state, but not yet resolved|rejected. Undefined, if param is omitted
     *
     * @chainable
     *
     * @return {xs.ux.Promise}
     */
    Class.method.then = xs.core.Promise.prototype.then;

    /**
     * Core promise method. Adds handler for promise future state, when it will be resolved or rejected
     * If no handler given, method does nothing. If any handler given, new promise object will be returned, constructing
     * chain of promise objects, allowing to perform stack of async operations
     *
     * @method otherwise
     *
     * @param {Function|undefined} handleDone handler, that will be called, when promise will be resolved or rejected
     *
     * @chainable
     *
     * @return {xs.ux.Promise}
     */
    Class.method.always = xs.core.Promise.prototype.always;

    /**
     * Core promise method. Adds handler for promise future state, when it will be rejected
     * If no handler given, method does nothing. If any handler given, new promise object will be returned, constructing
     * chain of promise objects, allowing to perform stack of async operations
     *
     * @method otherwise
     *
     * @param {Function|undefined} handleRejected handler, that will be called, when promise will be rejected
     *
     * @chainable
     *
     * @return {xs.ux.Promise}
     */
    Class.method.otherwise = xs.core.Promise.prototype.otherwise;

    /**
     * Core promise method. Adds handler for promise future state, when its progress will be changed (not rejected/resolved yet)
     * If no handler given, method does nothing. If any handler given, new promise object will be returned, constructing
     * chain of promise objects, allowing to perform stack of async operations
     *
     * @method progress
     *
     * @param {Function|undefined} handleProgress handler, that will be called, when promise will change it's progress state, but not yet resolved|rejected
     *
     * @chainable
     *
     * @return {xs.ux.Promise}
     */
    Class.method.progress = xs.core.Promise.prototype.progress;

    /**
     * Promise destroy method
     *
     * @method destroy
     */
    Class.method.destroy = function () {
        var me = this;

        //remove all handlers
        me.private.handlers.remove();

        //call parent method
        self.parent.prototype.destroy.call(me);
    };

});