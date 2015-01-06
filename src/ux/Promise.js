/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Implementation of Futures & Promises pattern for xs.js. Promise part
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.ux.Promise
 */
xs.define(xs.Class, 'ns.Promise', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.ux';

    Class.constants.PENDING = 'pending';
    Class.constants.RESOLVED = 'resolved';
    Class.constants.REJECTED = 'rejected';

    Class.properties.state = {
        set: xs.emptyFn
    };

    Class.constructor = function () {
        var me = this;

        xs.log(self.label + '::constructor');
        //initially - PENDING state
        me.private.state = self.PENDING;

        //create handlers collection
        me.private.handlers = new xs.core.Collection();
    };

    Class.methods.resolve = function (data) {
        var me = this;

        xs.log(self.label + '::resolve - data:', data);
        xs.assert.equal(me.private.state, self.PENDING, 'Promise is already resolved', PromiseError);

        //process promise on next tick
        xs.nextTick(function () {

            //set new state
            me.private.state = self.RESOLVED;

            _processPromise.call(me, 'resolve', data);
        });
    };

    Class.methods.reject = function (reason) {
        var me = this;

        xs.log(self.label + '::reject - reason:', reason);
        xs.assert.equal(me.private.state, self.PENDING, 'Promise is already rejected', PromiseError);

        //process promise on next tick
        xs.nextTick(function () {

            //set new state
            me.private.state = self.REJECTED;

            _processPromise.call(me, 'reject', reason);
        });
    };

    Class.methods.progress = function (state) {
        var me = this;

        xs.log(self.label + '::progress - state:', state);
        xs.assert.equal(me.private.state, self.PENDING, 'Promise is already ' + me.private.state, PromiseError);

        //process promise on next tick
        xs.nextTick(function () {

            //process promise handlers
            me.private.handlers.each(function (item) {
                if (item.progress) {
                    _handleItem(item, 'progress', state);
                }
            });
        });
    };

    Class.methods.then = function (handleResolved, handleRejected, handleProgress) {
        var me = this;

        xs.log(self.label + '::then');

        var item = _createItem(handleResolved, handleRejected, handleProgress);


        //if not handling - return me
        if (!item) {
            xs.log(self.label + '::then - no handlers given, returning self');

            return me;
        }


        xs.log(self.label + '::then - some handlers given, handling new item');
        //create new promise as item.promise
        item.promise = self.factory();

        //if promise is pending  - add item and return new promise
        if (me.private.state === self.PENDING) {
            //add item to handlers
            me.private.handlers.add(item);

            return item.promise;
        }


        //resolve item immediately
        _handleItem(item, me.private.state === self.RESOLVED ? 'resolve' : 'reject', me.private.data);

        //if promise is pending - add item to handlers

        return item.promise;
    };

    var _processPromise = function (action, data) {
        var me = this;

        //set promise data
        me.private.data = data;

        //process promise handlers
        me.private.handlers.each(function (item) {
            if (item[action]) {
                _handleItem(item, action, data);
            }
        });

        me.destroy();
    };

    var _handleItem = function (item, action, data) {

        xs.log(self.label + '::handleItem - ', action, 'with', data);

        //get handler for given type
        var handler = item[action];

        //get item.promise ref
        var promise = item.promise;

        try {
            //get handler result
            xs.log(self.label + '::handleItem - get result from', action, 'handler', handler, ',called with data:', data);
            var result = handler(data);

            //resolve item.promise with fetched result
            xs.log(self.label + '::handleItem - process item.promise with action "', action, '" and value', result);
            _resolveValue(promise, action, result);


            //reject if error happened
        } catch (e) {
            xs.log(self.label + '::handleItem - reject item.promise with exception:', e);
            promise.reject(e);
        }
    };

    var _resolveValue = function (promise, action, value) {
        xs.assert.ok(promise !== value, 'Value can not refer to the promise itself', {}, TypeError);

        //handle value, that is promise
        if (value instanceof self) {
            xs.log(self.label + '::resolveValue - value is', self.label, 'instance, continue with value.then');
            value.then(function (data) {
                promise.resolve(data);
            }, function (reason) {
                promise.reject(reason);
            }, function (state) {
                promise.progress(state);
            });

            return;

        }

        xs.log(self.label + '::resolveValue - value', value, ' is simple, ', action, ' promise with it');
        promise[action](value);
    };

    var _createItem = function (handleResolved, handleRejected, handleProgress) {
        //handlers must be either not defined or functions
        xs.assert.ok(!xs.isDefined(handleResolved) || xs.isFunction(handleResolved), 'createItem - given "$handleResolved" is not a function', {
            $handleResolved: handleResolved
        }, PromiseError);
        xs.assert.ok(!xs.isDefined(handleRejected) || xs.isFunction(handleRejected), 'createItem - given "$handleRejected" is not a function', {
            $handleResolved: handleRejected
        }, PromiseError);
        xs.assert.ok(!xs.isDefined(handleProgress) || xs.isFunction(handleProgress), 'createItem - given "$handleProgress" is not a function', {
            $handleResolved: handleProgress
        }, PromiseError);

        //if nothing given - return undefined
        if (!handleResolved && !handleRejected && !handleProgress) {
            xs.log(self.label + '::createItem - no handlers given');

            return undefined;
        }

        //new listener item
        var item = {};

        //add handleResolved if given
        if (handleResolved) {
            xs.log(self.label + '::createItem - resolve handler given');
            item.resolve = handleResolved;
        }

        //add handleRejected if given
        if (xs.isFunction(handleRejected)) {
            xs.log(self.label + '::createItem - reject handler given');
            item.reject = handleRejected;
        }

        //add handleProgress if given
        if (xs.isFunction(handleProgress)) {
            xs.log(self.label + '::createItem - progress handler given');
            item.progress = handleProgress;
        }

        return item;
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