'use strict';

//define xs.core.reactive
xs.getNamespace(xs, 'core.reactive');

var log = new xs.log.Logger('xs.core.reactive.Stream');

var assert = new xs.core.Asserter(log, XsCoreReactiveStreamError);

var Reactive = module.Reactive;

var Stream = xs.core.reactive.Stream = function (generator, sources) {
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
 * @return {xs.core.reactive.Stream}
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
 * @return {xs.core.reactive.Stream}
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
 * @return {xs.core.reactive.Property}
 */
Stream.prototype.toProperty = function (current) {
    var me = this;

    return new xs.core.reactive.Property(toProperty, current, [
        me
    ]);
};

/**
 * Creates new stream, that maps incoming values via given fn
 *
 * @method map
 *
 * @param {Function} fn mapping function, that returns mapped value
 *
 * @return {xs.core.reactive.Stream}
 */
Stream.prototype.map = function (fn) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'map - reactive is destroyed');

    //assert, that function is given
    assert.fn(fn, 'map - given `$fn` is not a function', {
        $fn: fn
    });


    //create stream
    return new me.constructor(map, [
        me,
        fn
    ]);
};

/**
 * Creates new stream, that filters incoming values via given fn
 *
 * @method filter
 *
 * @param {Function} fn filtering function, that should return boolean value, saying to allow pass event or not
 *
 * @return {xs.core.reactive.Stream}
 */
Stream.prototype.filter = function (fn) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'filter - reactive is destroyed');

    //assert, that function is given
    assert.fn(fn, 'filter - given `$fn` is not a function', {
        $fn: fn
    });


    //create stream
    return new me.constructor(filter, [
        me,
        fn
    ]);
};

/**
 * Creates new stream, that transforms incoming values via given transducer //TODO
 *
 * @method transduce
 *
 * @return {xs.core.reactive.Stream}
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
 * @return {xs.core.reactive.Stream}
 */
Stream.prototype.throttle = function (interval) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'throttle - reactive is destroyed');

    //assert, that interval is a number
    assert.number(interval, 'throttle - given `$interval` is not a number', {
        $interval: interval
    });


    //create stream
    return new me.constructor(throttle, [
        me,
        interval
    ]);
};

/**
 * Creates new stream, that puts aside sending incoming values until given interval goes out
 *
 * @method debounce
 *
 * @param {Number} interval awaiting interval
 *
 * @return {xs.core.reactive.Stream}
 */
Stream.prototype.debounce = function (interval) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'debounce - reactive is destroyed');

    //assert, that interval is a number
    assert.number(interval, 'debounce - given `$interval` is not a number', {
        $interval: interval
    });


    //create stream
    return new me.constructor(debounce, [
        me,
        interval
    ]);
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

function toProperty(stream) {
    var me = this;

    //on value - set
    stream.on(function (data) {
        me.set(data);
    });

    //on destroy - destroy
    stream.on(xs.core.reactive.event.Destroy, me.destroy);
}

function map(source, fn) {
    var me = this;

    //on value - send
    source.on(function (data) {
        me.send(fn(data));
    });

    //on destroy - destroy
    source.on(xs.core.reactive.event.Destroy, me.destroy);
}

function filter(source, fn) {
    var me = this;

    //on value - set
    source.on(function (data) {
        if (fn(data)) {
            me.send(data);
        }
    });

    //on destroy - destroy
    source.on(xs.core.reactive.event.Destroy, me.destroy);
}

function throttle(source, interval) {
    var me = this;

    var lastTime = -Infinity;

    //on value - change current
    source.on(function (data) {
        //get current time
        var time = (new Date()).valueOf();

        //if enough time passed - set value
        if (time - lastTime >= interval) {

            //update lastTime
            lastTime = time;

            //set stream value
            me.send(data);
        }
    });

    //on destroy - destroy
    source.on(xs.core.reactive.event.Destroy, me.destroy);
}

function debounce(source, interval) {
    var me = this;

    var timeoutId;

    //on value - change current
    source.on(function (data) {

        //clear previous timeout
        clearTimeout(timeoutId);

        //set timeout for setting value
        timeoutId = setTimeout(function () {

            //set stream value
            me.send(data);

            //if source is destroyed - destroy
            if (sourceDestroyed) {
                me.destroy();
            }
        }, interval);
    });

    var sourceDestroyed = false;

    //on destroy - destroy
    source.on(xs.core.reactive.event.Destroy, function () {

        //if timeout defined - awaiting initiated, needed delayed destroy
        if (xs.isDefined(timeoutId)) {

            //set flag, that source is destroyed
            sourceDestroyed = true;

            //else - can destroy stream immediately
        } else {
            me.destroy();
        }
    });
}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsCoreReactiveStreamError
 */
function XsCoreReactiveStreamError(message) {
    this.message = 'xs.core.reactive.Stream::' + message;
}

XsCoreReactiveStreamError.prototype = new Error();