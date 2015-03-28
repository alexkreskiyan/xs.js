'use strict';

var log = new xs.log.Logger('xs.reactive.Stream');

var assert = new xs.core.Asserter(log, XsReactiveStreamError);

if (!xs.reactive) {
    xs.reactive = {};
}

var Reactive = module.Reactive;

var Stream = xs.reactive.Stream = function (generator, sources) {
    var me = this;

    if (arguments.length < 2) {
        Reactive.call(me, generator, new module.EmitterStream(me));
    } else {
        Reactive.call(me, generator, new module.EmitterStream(me), sources);
    }
};

//extend Stream from Reactive
xs.extend(Stream, Reactive);

/**
 * Creates reactive stream from promise
 *
 * @static
 *
 * @method fromPromise
 *
 * @param {Object} promise reactive source promise
 *
 * @return {xs.reactive.Stream}
 */
Stream.fromPromise = function (promise) {

    //assert, that a promise given
    assert.ok(xs.core.Promise.isPromise(promise), 'fromPromise - given `$promise` is not a promise object', {
        $promise: promise
    });

    return new this(fromPromise, [ promise ]);
};

function fromPromise(stream, promise) {
    promise.then(function (data) {
        stream.send({
            state: xs.core.Promise.Resolved,
            data: data
        });
    }, function (error) {
        stream.send({
            state: xs.core.Promise.Rejected,
            error: error
        });
    }, function (progress) {
        stream.send({
            state: xs.core.Promise.Pending,
            progress: progress
        });
    }).always(stream.destroy);
}

/**
 * Creates reactive stream from event
 *
 * @static
 *
 * @method fromEvent
 *
 * @param {Element} element event emitter
 * @param {String} eventName name of subscribed event
 *
 * @return {xs.reactive.Stream}
 */
Stream.fromEvent = function (element, eventName) {

    //assert, that an Element is given
    assert.ok(element instanceof Element, 'fromEvent - given `$element` is not an Element instance', {
        $element: element
    });

    //assert, that an eventName is string
    assert.string(eventName, 'fromEvent - given `$eventName` is not a string', {
        $eventName: eventName
    });

    return new this(fromEvent, [
        element,
        eventName
    ]);
};

function fromEvent(stream, element, eventName) {

    var handler = function (event) {
        stream.send(event);
    };

    return {
        on: function () {
            element.addEventListener(eventName, handler);
        },
        off: function () {
            element.removeEventListener(eventName, handler);
        }
    };
}

/**
 * Converts stream to a property, optionally, setting initial property value
 *
 * @method toProperty
 *
 * @param {Boolean} [current] whether to send current value on next tick
 *
 * @return {xs.reactive.Property}
 */
Stream.prototype.toProperty = function (current) {
    var me = this;

    return new xs.reactive.Property(toProperty, current, [
        me
    ]);
};

function toProperty(property, stream) {

    //on value - set
    stream.on(function (event) {
        property.set(event.data);
    });

    //on destroy - destroy
    stream.on(property.destroy, {
        target: xs.reactive.event.Destroy
    });
}

/**
 * Creates new stream, that maps incoming values via given fn
 *
 * @method map
 *
 * @param {Function} fn mapping function, that returns mapped value
 *
 * @return {xs.reactive.Stream}
 */
Stream.prototype.map = function (fn) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'map - reactive is destroyed');

    //assert, that function is given
    assert.fn(fn, 'map - given `$fn` is not a function', {
        $fn: fn
    });

    return new this.constructor(map, [
        me,
        fn
    ]);
};

function map(stream, source, fn) {

    //on value - send
    source.on(function (event) {
        stream.send(fn(event.data));
    });

    //on destroy - destroy
    source.on(stream.destroy, {
        target: xs.reactive.event.Destroy
    });
}

/**
 * Creates new stream, that filters incoming values via given fn
 *
 * @method filter
 *
 * @param {Function} fn filtering function, that should return boolean value, saying to allow pass event or not
 *
 * @return {xs.reactive.Stream}
 */
Stream.prototype.filter = function (fn) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'filter - reactive is destroyed');

    //assert, that function is given
    assert.fn(fn, 'filter - given `$fn` is not a function', {
        $fn: fn
    });

    return new this.constructor(filter, [
        me,
        fn
    ]);
};

function filter(stream, source, fn) {

    //on value - set
    source.on(function (event) {
        if (fn(event.data)) {
            stream.send(event.data);
        }
    });

    //on destroy - destroy
    source.on(stream.destroy, {
        target: xs.reactive.event.Destroy
    });
}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsReactiveStreamError
 */
function XsReactiveStreamError(message) {
    this.message = 'xs.reactive.Stream::' + message;
}

XsReactiveStreamError.prototype = new Error();