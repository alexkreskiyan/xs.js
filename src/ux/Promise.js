/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
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
 * @class xs.ux.Promise
 */
xs.define(xs.Class, 'ns.Promise', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.ux';

    /**
     * Promise "pending" state constant
     *
     * @static
     *
     * @property PENDING
     *
     * @readonly
     *
     * @type {String}
     */
    Class.constant.PENDING = 'pending';

    /**
     * Promise "resolved" state constant
     *
     * @static
     *
     * @property RESOLVED
     *
     * @readonly
     *
     * @type {String}
     */
    Class.constant.RESOLVED = 'resolved';

    /**
     * Promise "rejected" state constant
     *
     * @static
     *
     * @property REJECTED
     *
     * @readonly
     *
     * @type {String}
     */
    Class.constant.REJECTED = 'rejected';

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
    Class.static.method.all = function (promises) {
        xs.assert.array(promises, 'all - given "$promises" are not array', {
            $promises: promises
        }, PromiseError);

        return this.some(promises, promises.length);
    };

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
    Class.static.method.some = function (promises, count) {
        xs.assert.array(promises, 'some - given "$promises" are not array', {
            $promises: promises
        }, PromiseError);

        xs.assert.ok(promises.length, 'some - given "$promises" array is empty', {
            $promises: promises
        }, PromiseError);

        //assert that count is number
        if (arguments.length === 1) {
            count = 1;
        } else {
            xs.assert.number(count, 'some - given "$count" is not a number', {
                $count: count
            }, PromiseError);
        }

        xs.assert.ok(0 < count && count <= promises.length, 'some - given count "$count" is out of bounds [$min, $max]', {
            $count: count,
            $min: 0,
            $max: promises.length
        }, PromiseError);

        //convert promises to collection
        promises = new xs.core.Collection(promises);

        //create aggregate promise
        var aggregate = self.factory();

        promises.each(function (promise) {
            xs.assert.instance(promise, self, 'given not promise', PromiseError);
            promise.then(function () {
                //if count is 0 and aggregate is still pending - resolve it
                if (--count === 0 && aggregate.state === self.PENDING) {
                    aggregate.resolve();
                }
            }, function (reason) {
                aggregate.reject(reason);
            });
        });

        return aggregate;
    };

    /**
     * Promise state. Is changed internally from {@link #PENDING pending} to {@link #RESOLVED resolved} or {@link #REJECTED rejected}
     *
     * @property state
     *
     * @readonly
     *
     * @type {String}
     */
    Class.property.state = {
        set: xs.emptyFn
    };

    /**
     * Promise constructor
     *
     * @constructor
     */
    Class.constructor = function () {
        var me = this;

        self.log.trace('constructor');
        //initially - PENDING state
        me.private.state = self.PENDING;

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
    Class.method.resolve = function (data) {
        var me = this;

        xs.assert.not(me.private.isDestroyed, 'Object is destroyed', PromiseError);
        self.log.trace('resolve - data', {
            data: data
        });
        xs.assert.equal(me.private.state, self.PENDING, 'Promise is already resolved', PromiseError);

        //set new state
        me.private.state = self.RESOLVED;

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
    Class.method.reject = function (reason) {
        var me = this;

        xs.assert.not(me.private.isDestroyed, 'Object is destroyed', PromiseError);
        self.log.trace('reject - reason', {
            reason: reason
        });
        xs.assert.equal(me.private.state, self.PENDING, 'Promise is already rejected', PromiseError);

        //set new state
        me.private.state = self.REJECTED;

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
    Class.method.update = function (state) {
        var me = this;

        xs.assert.not(me.private.isDestroyed, 'Object is destroyed', PromiseError);
        self.log.trace('update - state', {
            state: state
        });
        xs.assert.equal(me.private.state, self.PENDING, 'Promise is already ' + me.private.state, PromiseError);

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
     * @return {xs.ux.Promise}
     */
    Class.method.then = function (handleResolved, handleRejected, handleProgress) {
        var me = this;

        xs.assert.not(me.private.isDestroyed, 'Object is destroyed', PromiseError);
        self.log.trace('then');

        var item = createItem(handleResolved, handleRejected, handleProgress);


        //if not handling - return me
        if (!item) {
            self.log.trace('then - no handlers given, returning self');

            return me;
        }


        self.log.trace('then - some handlers given, handling new item');
        //create new promise as item.promise
        item.promise = self.factory();

        //if promise is pending  - add item and return new promise
        if (me.private.state === self.PENDING) {
            //add item to handlers
            me.private.handlers.add(item);

            return item.promise;
        }


        //resolve item on next tick
        xs.nextTick(function () {
            handleItem(item, me.private.state === self.RESOLVED ? 'resolve' : 'reject', me.private.data);
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
     * @return {xs.ux.Promise}
     */
    Class.method.otherwise = function (handleRejected) {
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
     * @return {xs.ux.Promise}
     */
    Class.method.progress = function (handleProgress) {
        return this.then(undefined, undefined, handleProgress);
    };

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

        self.log.trace('handleItem - ' + action + 'with data', {
            data: data
        });

        //get handler for given type
        var handler = item[action];

        //get item.promise ref
        var promise = item.promise;

        try {
            //get handler result
            self.log.trace('handleItem - get result from ' + action + ' handler, called with data', {
                handler: handler,
                data: data
            });
            var result = handler(data);

            //resolve item.promise with fetched result
            self.log.trace('handleItem - process item.promise with action ' + action + ' and value', {
                value: result
            });
            resolveValue(promise, action, result);


            //reject if error happened
        } catch (exception) {
            self.log.trace('handleItem - reject item.promise with exception', {
                exception: exception
            });
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
     * @param {xs.ux.Promise} promise promise, value is resolved for
     * @param {String} action promise action
     * @param {*} value resolved value
     */
    var resolveValue = function (promise, action, value) {
        xs.assert.ok(promise !== value, 'Value can not refer to the promise itself', {}, TypeError);

        //handle value, that is promise
        if (value instanceof self) {
            self.log.trace('resolveValue - value is ' + self.label + ' instance, continue with value.then');
            value.then(function (data) {
                promise.resolve(data);
            }, function (reason) {
                promise.reject(reason);
            }, function (state) {
                promise.update(state);
            });

            return;

        }

        self.log.trace('resolveValue - value is simple, ' + action + ' promise with it', {
            value: value
        });
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
        xs.assert.ok(!xs.isDefined(handleResolved) || xs.isFunction(handleResolved), 'createItem - given "$handleResolved" is not a function', {
            $handleResolved: handleResolved
        }, PromiseError);
        xs.assert.ok(!xs.isDefined(handleRejected) || xs.isFunction(handleRejected), 'createItem - given "$handleRejected" is not a function', {
            $handleRejected: handleRejected
        }, PromiseError);
        xs.assert.ok(!xs.isDefined(handleProgress) || xs.isFunction(handleProgress), 'createItem - given "$handleProgress" is not a function', {
            $handleProgress: handleProgress
        }, PromiseError);

        //if something given - return item
        if (handleResolved || handleRejected || handleProgress) {
            self.log.trace('createItem - some handlers given');

            return {
                resolve: handleResolved,
                reject: handleRejected,
                update: handleProgress
            };
        }

        self.log.trace('createItem - no handlers given');

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
        this.message = self.label + '::' + message;
    }

    PromiseError.prototype = new Error();
});