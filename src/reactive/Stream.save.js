'use strict';

var log = new xs.log.Logger('xs.core.Promise');

var assert = new xs.core.Asserter(log, StreamError);

//define xs.reactive
if (!xs.reactive) {
    xs.reactive = {};
}

/**
 * xs.reactive.Stream is core framework class, that is used for reactive representations
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.reactive.Stream
 */

/**
 * xs.reactive.Stream constructor
 *
 * @constructor
 */
var Stream = xs.reactive.Stream = function (emitter) {
    var me = this;

    //create private storage
    me.private = {};

    //assert, that emitter is a function
    assert.fn(emitter, 'constructor - given emitter `$emitter` is not a function', {
        $emitter: emitter
    });

    //run emitter with 2 arguments - send, end
    var handlers = emitter(function (data) {
        //send data in stream
        sendData.call(me, data);
    }, function () {

        //destroy stream
        me.destroy();
    });

    //assert, that handlers is an object
    assert.object(handlers, 'constructor - given handlers hash `$handlers` is not an object', {
        $handlers: handlers
    });

    //assert, that handlers.on is a function
    assert.fn(handlers.on, 'constructor - given handlers.on `$on` is not a function', {
        $on: handlers.on
    });

    //assert, that handlers.off is a function
    assert.fn(handlers.off, 'constructor - given handlers.off `$off` is not a function', {
        $off: handlers.off
    });

    //create listeners collection
    me.private.listeners = new xs.core.Collection();

    //save handlers
    me.private.on = handlers.on;
    me.private.off = handlers.off;
};

//TODO: Base streams, EmitterStream, MutationStream

//active state of stream

//Stream common creating methods
Stream.fromPromise = function (promise) {

};

Stream.fromEvent = function (element, eventName) {

};


/**
 * Property, that returns whether object is destroyed
 *
 * @readonly
 *
 * @property isDestroyed
 *
 * @type {Boolean}
 */
xs.property.define(Stream.prototype, 'isDestroyed', xs.property.prepare('isDestroyed', {
    get: function () {
        return !this.hasOwnProperty('private');
    },
    set: xs.emptyFn
}));

/**
 * Property, that returns whether stream is active
 *
 * @readonly
 *
 * @property isActive
 *
 * @type {Boolean}
 */
xs.property.define(Stream.prototype, 'isActive', xs.property.prepare('isActive', {
    get: function () {
        return this.private.listeners.length > 0;
    },
    set: xs.emptyFn
}));


//Stream mutation methods


//Stream combination methods


//adds listener to stream
Stream.prototype.listen = function (listener) {
    var me = this;
    addListener.call(me, listener);
};

Stream.prototype.destroy = function () {
    var me = this;
    console.log('destroy');

    //remove all listeners
    me.private.listeners.remove();

    //call off handler
    me.private.off();

    delete me.private;
};

function sendData(data) {
    var me = this;
    console.log('send', data);
    if (!me.active) {

        return;
    }

    //process listeners
    me.private.listeners.each(function (listener) {
        listener(data);
    });
}

function addListener(listener) {
    var me = this;

    //TODO listener can be either reactive item or function. Reactive item is destroyed, when removed from it's owner
    //assert, that listener is a function
    assert.fn(listener, 'addListener - given listener `$listener` is not a function', {
        $listener: listener
    });

    //activate if not
    if (!me.isActive) {
        me.private.on();
    }

    //add listener
    me.private.listeners.add(listener);
}

//function removeListener(listener) {
//
//}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class StreamError
 */
function StreamError(message) {
    this.message = 'xs.reactive.Stream::' + message;
}

StreamError.prototype = new Error();