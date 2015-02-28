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

    var log = new xs.log.Logger('xs.core.Promise');

    var assert = new xs.core.Asserter(log, PromiseError);

    //define xs.core
    if (!xs.core) {
        xs.core = {};
    }

    /**
     * Implementation of Futures & Promises pattern for xs.js.
     *
     * Usage example:
     *
     *     var getData = function() {
     *         var promise = new xs.core.Promise();
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
     *             xs.extend(data, update);
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
     * @class xs.core.Promise
     */

    /**
     * Promise constructor
     *
     * @constructor
     */
    xs.core.Promise = function () {
        var me = this;

        //init private storage
        me.private = {};

        //initially - Pending state
        me.private.state = xs.core.Promise.Pending;

        //create handlers collection
        me.private.handlers = new xs.core.Collection();
    };

    /**
     * Promise `pending` state constant
     *
     * @static
     *
     * @property Pending
     *
     * @readonly
     *
     * @type {String}
     */
    xs.constant(xs.core.Promise, 'Pending', 0);

    /**
     * Promise `resolved` state constant
     *
     * @static
     *
     * @property Resolved
     *
     * @readonly
     *
     * @type {String}
     */
    xs.constant(xs.core.Promise, 'Resolved', 1);

    /**
     * Promise `rejected` state constant
     *
     * @static
     *
     * @property Rejected
     *
     * @readonly
     *
     * @type {String}
     */
    xs.constant(xs.core.Promise, 'Rejected', 2);

    /**
     * Static async control operating method. Creates aggregate promise, that is resolved when all
     * given promises are resolved. If any promise among given is rejected, aggregate promise is rejected with that reason
     *
     * @method all
     *
     * @param {xs.core.Promise[]} promises array of promises
     *
     * @return {xs.core.Promise} aggregate promise
     */
    xs.core.Promise.all = function (promises) {
        assert.array(promises, 'all - given `$promises` are not array', {
            $promises: promises
        });

        return this.some(promises, promises.length);
    };

    /**
     * Static async control operating method. Creates aggregate promise, that is resolved when some (count is specified by second param)
     * of given promises are resolved. If any promise among given is rejected, aggregate promise is rejected with that reason
     *
     * @method some
     *
     * @param {xs.core.Promise[]} promises array of promises
     * @param {Number} count count of promises, needed for aggregate promise to resolve
     *
     * @return {xs.core.Promise} aggregate promise
     */
    xs.core.Promise.some = function (promises, count) {
        assert.array(promises, 'some - given `$promises` are not array', {
            $promises: promises
        });

        assert.ok(promises.length, 'some - given `$promises` array is empty', {
            $promises: promises
        });

        //assert that count is number
        if (arguments.length === 1) {
            count = 1;
        } else {
            assert.number(count, 'some - given `$count` is not a number', {
                $count: count
            });
        }

        assert.ok(0 < count && count <= promises.length, 'some - given count `$count` is out of bounds [$min, $max]', {
            $count: count,
            $min: 0,
            $max: promises.length
        });

        //create aggregate promise
        var aggregate = new xs.core.Promise();

        //use promises as collection
        (new xs.core.Collection(promises)).each(function (promise) {
            assert.instance(promise, xs.core.Promise, 'some - given not promise');
            promise.then(function () {
                //if count is 0 and aggregate is still pending - resolve it
                if (--count === 0 && aggregate.state === xs.core.Promise.Pending) {
                    aggregate.resolve();
                }
            }, function (reason) {
                aggregate.reject(reason);
            });
        });

        return aggregate;
    };

    /**
     * Promise state. Is changed internally from {@link #Pending pending} to {@link #Resolved resolved} or {@link #Rejected rejected}
     *
     * @property state
     *
     * @readonly
     *
     * @type {String}
     */
    xs.property.define(xs.core.Promise.prototype, 'state', xs.property.prepare('state', {
        set: xs.emptyFn
    }));

    /**
     * Promise resolve method. Resolves promise, running consequently it's handlers
     *
     * @method resolve
     *
     * @param {*} data data, promise is resolved with
     */
    xs.core.Promise.prototype.resolve = function (data) {
        var me = this;

        assert.equal(me.private.state, xs.core.Promise.Pending, 'resolve - promise is already resolved');

        //set new state
        me.private.state = xs.core.Promise.Resolved;

        //process promise on next tick
        xs.nextTick(function () {
            processPromise.call(me, 'resolve', data);
        });
    };

    /**
     * Promise reject method. Rejects promise, running consequently it's handlers
     *
     * @method reject
     *
     * @param {*} reason reason, for which promise is rejected
     */
    xs.core.Promise.prototype.reject = function (reason) {
        var me = this;

        //assert, that promise is not destroyed yet
        assert.not(me.private.isDestroyed, 'reject - object is destroyed');

        //assert, that promise is pending
        assert.equal(me.private.state, xs.core.Promise.Pending, 'reject - promise is already rejected');

        //set new state
        me.private.state = xs.core.Promise.Rejected;

        //process promise on next tick
        xs.nextTick(function () {
            processPromise.call(me, 'reject', reason);
        });
    };

    /**
     * Promise update method. Doesn't change promise state, only consequently runs all registered progress handlers.
     * So, this method could be run many times before promise is resolved or rejected. After that, update method is prohibited
     *
     * @method update
     *
     * @param {*} state some value, that means updated state of pending operation, handled by promise
     */
    xs.core.Promise.prototype.update = function (state) {
        var me = this;

        //assert, that promise is not destroyed yet
        assert.not(me.private.isDestroyed, 'update - object is destroyed');

        //assert, that promise is pending
        assert.equal(me.private.state, xs.core.Promise.Pending, 'update - promise is already ' + me.private.state);

        //process promise on next tick
        xs.nextTick(function () {

            //process promise handlers
            me.private.handlers.each(function (item) {
                if (item.update) {
                    handleItem(item, 'update', state);
                }
            });
        });
    };

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
     * @return {xs.core.Promise}
     */
    xs.core.Promise.prototype.then = function (handleResolved, handleRejected, handleProgress) {
        var me = this;

        //assert, that promise is not destroyed yet
        assert.not(me.private.isDestroyed, 'then - object is destroyed');

        var item = createItem(handleResolved, handleRejected, handleProgress);


        //if not handling - return me
        if (!item) {

            return me;
        }


        //create new promise as item.promise
        item.promise = new xs.core.Promise();

        //if promise is pending  - add item and return new promise
        if (me.private.state === xs.core.Promise.Pending) {
            //add item to handlers
            me.private.handlers.add(item);

            return item.promise;
        }


        //resolve item on next tick
        xs.nextTick(function () {
            handleItem(item, me.private.state === xs.core.Promise.Resolved ? 'resolve' : 'reject', me.private.data);
        });

        //if promise is pending - add item to handlers

        return item.promise;
    };

    /**
     * Core promise method. Adds handler for promise future state, when it will be rejected
     * If no handler given, method does nothing. If any handler given, new promise object will be returned, constructing
     * chain of promise objects, allowing to perform stack of async operations
     *
     * @method otherwise
     *
     * @param {Function|undefined} [handleRejected] handler, that will be called, when promise will be rejected. Undefined, if param is omitted
     *
     * @chainable
     *
     * @return {xs.core.Promise}
     */
    xs.core.Promise.prototype.otherwise = function (handleRejected) {
        return this.then(undefined, handleRejected);
    };

    /**
     * Core promise method. Adds handler for promise future state, when its progress will be changed (not rejected/resolved yet)
     * If no handler given, method does nothing. If any handler given, new promise object will be returned, constructing
     * chain of promise objects, allowing to perform stack of async operations
     *
     * @method progress
     *
     * @param {Function|undefined} [handleProgress] handler, that will be called, when promise will change it's progress state, but not yet resolved|rejected. Undefined, if param is omitted
     *
     * @chainable
     *
     * @return {xs.core.Promise}
     */
    xs.core.Promise.prototype.progress = function (handleProgress) {
        return this.then(undefined, undefined, handleProgress);
    };

    /**
     * Promise destroy method
     *
     * @method destroy
     */
    xs.core.Promise.prototype.destroy = function () {
        var me = this;

        //remove all handlers
        me.private.handlers.remove();

        //mark promise as destroyed
        me.private = {
            isDestroyed: true
        };
    };

    /**
     * Processes promise with given action
     *
     * @ignore
     *
     * @private
     *
     * @method processPromise
     *
     * @param {String} action promise action
     * @param {*} data processed data
     */
    var processPromise = function (action, data) {
        var me = this;

        //set promise data
        me.private.data = data;

        //process promise handlers
        me.private.handlers.each(function (item) {
            if (item[action]) {
                handleItem(item, action, data);
            }
        });

        //remove all handlers
        me.private.handlers.remove();
    };

    /**
     * Handles promise item.
     *
     * @ignore
     *
     * @private
     *
     * @method handleItem
     *
     * @param {Object} item handled item
     * @param {String} action promise action
     * @param {*} data processed data
     */
    var handleItem = function (item, action, data) {

        //get handler for given type
        var handler = item[action];

        //get item.promise ref
        var promise = item.promise;

        try {
            //get handler result
            var result = handler(data);

            //resolve item.promise with fetched result
            resolveValue(promise, action, result);


            //reject if error happened
        } catch (exception) {
            promise.reject(exception);
        }
    };

    /**
     * Resolves value of promise
     *
     * @ignore
     *
     * @private
     *
     * @method resolveValue
     *
     * @param {xs.core.Promise} promise promise, value is resolved for
     * @param {String} action promise action
     * @param {*} value resolved value
     */
    var resolveValue = function (promise, action, value) {
        assert.ok(promise !== value, 'resolveValue - value can not refer to the promise itself', {}, TypeError);

        //handle value, that is promise
        if (value instanceof xs.core.Promise) {
            value.then(function (data) {
                promise.resolve(data);
            }, function (reason) {
                promise.reject(reason);
            }, function (state) {
                promise.update(state);
            });

            return;

        }

        promise[action](value);
    };

    /**
     * Creates promise item depending on given incoming callbacks
     *
     * @ignore
     *
     * @private
     *
     * @method createItem
     *
     * @param {Function|undefined} handleResolved resolved handler
     * @param {Function|undefined} handleRejected rejected handler
     * @param {Function|undefined} handleProgress progress handler
     *
     * @return {Object|undefined} created item or undefined if no handlers given
     */
    var createItem = function (handleResolved, handleRejected, handleProgress) {
        //handlers must be either not defined or functions
        assert.ok(!xs.isDefined(handleResolved) || xs.isFunction(handleResolved), 'createItem - given `$handleResolved` is not a function', {
            $handleResolved: handleResolved
        });
        assert.ok(!xs.isDefined(handleRejected) || xs.isFunction(handleRejected), 'createItem - given `$handleRejected` is not a function', {
            $handleRejected: handleRejected
        });
        assert.ok(!xs.isDefined(handleProgress) || xs.isFunction(handleProgress), 'createItem - given `$handleProgress` is not a function', {
            $handleProgress: handleProgress
        });

        //if something given - return item
        if (handleResolved || handleRejected || handleProgress) {

            return {
                resolve: handleResolved,
                reject: handleRejected,
                update: handleProgress
            };
        }

        return undefined;
    };


    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class PromiseError
     */
    function PromiseError(message) {
        this.message = 'xs.core.Promise::' + message;
    }

    PromiseError.prototype = new Error();

})(window, 'xs');