'use strict';

var log = new xs.log.Logger('xs.reactive.Stream');

var assert = new xs.core.Asserter(log, XsReactiveStreamError);

var Reactive = module.Reactive;

var Stream = xs.reactive.Stream = function (generator, sources) {
    var me = this;

    if (arguments.length < 2) {
        Reactive.call(me, generator, new module.emitter.Stream(me));
    } else {
        Reactive.call(me, generator, new module.emitter.Stream(me), sources);
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

    var descendant = new xs.reactive.Property(xs.noop, current);

    module.defineInheritanceRelations(me, descendant, descendant.private.emitter.set, xs.bind(descendant.destroy, descendant));

    return descendant;
};

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

    var descendant = new me.constructor(xs.noop);
    var send = descendant.private.emitter.send;

    module.defineInheritanceRelations(me, descendant, function (data) {
        send(fn(data));
    }, xs.bind(descendant.destroy, descendant));

    return descendant;
};

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

    var descendant = new me.constructor(xs.noop);
    var send = descendant.private.emitter.send;

    var dataHandler;

    //filter by event if event given
    if (module.isEvent(fn)) {
        dataHandler = function (data) {
            if (data !== undefined && data !== null && data.constructor === fn) {
                send(data);
            }
        };
    } else {
        dataHandler = function (data) {
            if (fn(data)) {
                send(data);
            }
        };
    }

    module.defineInheritanceRelations(me, descendant, dataHandler, xs.bind(descendant.destroy, descendant));

    return descendant;
};

/**
 * Creates new stream, that transforms incoming values via given transducer //TODO
 *
 * @method transduce
 *
 * @return {xs.reactive.Stream}
 */
Stream.prototype.transduce = function () {
};

/**
 * Creates new stream, that throttles incoming values according to given interval
 *
 * @method throttle
 *
 * @param {Number} interval throttling interval
 *
 * @return {xs.reactive.Stream}
 */
Stream.prototype.throttle = function (interval) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'throttle - reactive is destroyed');

    //assert, that interval is a number
    assert.number(interval, 'throttle - given `$interval` is not a number', {
        $interval: interval
    });

    var descendant = new me.constructor(xs.noop);
    var send = descendant.private.emitter.send;

    module.defineInheritanceRelations(me, descendant, xs.Function.throttle(send, interval), xs.bind(descendant.destroy, descendant));

    return descendant;
};

/**
 * Creates new stream, that puts aside sending incoming values until given interval goes out
 *
 * @method debounce
 *
 * @param {Number} interval awaiting interval
 *
 * @return {xs.reactive.Stream}
 */
Stream.prototype.debounce = function (interval) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'debounce - reactive is destroyed');

    //assert, that interval is a number
    assert.number(interval, 'debounce - given `$interval` is not a number', {
        $interval: interval
    });

    var descendant = new me.constructor(xs.noop);
    var send = descendant.private.emitter.send;

    module.defineInheritanceRelations(me, descendant, xs.Function.debounce(send, interval), xs.bind(descendant.destroy, descendant));

    return descendant;
};

function fromPromise(promise) {
    var me = this;

    promise.then(function (data) {
        me.send({
            state: xs.core.Promise.Resolved,
            data: data
        });
    }, function (error) {
        me.send({
            state: xs.core.Promise.Rejected,
            error: error
        });
    }, function (progress) {
        me.send({
            state: xs.core.Promise.Pending,
            progress: progress
        });
    }).always(me.destroy);
}

function fromEvent(element, eventName) {
    var me = this;

    var handler = function (data) {
        me.send(data);
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