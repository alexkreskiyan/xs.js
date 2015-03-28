'use strict';

var log = new xs.log.Logger('xs.reactive.Property');

var assert = new xs.core.Asserter(log, XsReactivePropertyError);

if (!xs.reactive) {
    xs.reactive = {};
}

var Reactive = module.Reactive;

var Property = xs.reactive.Property = function (generator, value, sources) {
    var me = this;

    if (arguments.length < 3) {
        Reactive.call(me, generator, new module.EmitterProperty(me));
    } else {
        Reactive.call(me, generator, new module.EmitterProperty(me), sources);
    }

    //set initial property value
    me.private.value = value;
};

//extend Property from Reactive
xs.extend(Property, Reactive);

/**
 * Creates reactive property from promise
 *
 * @static
 *
 * @method fromPromise
 *
 * @param {Object} promise reactive source promise
 *
 * @return {xs.reactive.Property}
 */
Property.fromPromise = function (promise) {

    //assert, that a promise given
    assert.ok(xs.core.Promise.isPromise(promise), 'fromPromise - given `$promise` is not a promise object', {
        $promise: promise
    });

    return new this(fromPromise, {
        state: xs.core.Promise.Pending,
        progress: undefined
    }, [ promise ]);
};

/**
 * Creates reactive property from event
 *
 * @static
 *
 * @method fromEvent
 *
 * @param {Element} element event emitter
 * @param {String} eventName name of subscribed event
 *
 * @return {xs.reactive.Property}
 */
Property.fromEvent = function (element, eventName) {

    //assert, that an Element is given
    assert.ok(element instanceof Element, 'fromEvent - given `$element` is not an Element instance', {
        $element: element
    });

    //assert, that an eventName is string
    assert.string(eventName, 'fromEvent - given `$eventName` is not a string', {
        $eventName: eventName
    });

    return new this(fromEvent, undefined, [
        element,
        eventName
    ]);
};

/**
 * Property current value
 *
 * @property value
 *
 * @readonly
 *
 * @type {Boolean}
 */
Object.defineProperty(Property.prototype, 'value', {
    get: function () {
        var me = this;

        //assert, that reactive is not destroyed
        assert.not(me.isDestroyed, 'get:value - reactive is destroyed');

        return me.private.value;
    },
    set: xs.noop,
    configurable: false,
    enumerable: true
});

/**
 * Converts property to a stream, optionally, sending current value immediately
 *
 * @method toStream
 *
 * @param {Boolean} [sendCurrent] whether to send current value on next tick
 *
 * @return {xs.reactive.Stream}
 */
Property.prototype.toStream = function (sendCurrent) {
    var me = this;

    assert.ok(!arguments.length || xs.isBoolean(sendCurrent), 'toStream - given `$sendCurrent` is not a boolean value', {
        $sendCurrent: sendCurrent
    });

    return new xs.reactive.Stream(toStream, [
        me,
        sendCurrent
    ]);
};

/**
 * Creates new property, that maps incoming values via given fn
 *
 * @method map
 *
 * @param {Function} fn mapping function, that returns mapped value
 *
 * @return {xs.reactive.Property}
 */
Property.prototype.map = function (fn) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'map - reactive is destroyed');

    //assert, that function is given
    assert.fn(fn, 'map - given `$fn` is not a function', {
        $fn: fn
    });


    //create property
    return new me.constructor(map, fn(me.value), [
        me,
        fn
    ]);
};

/**
 * Creates new property, that filters incoming values via given fn
 *
 * @method filter
 *
 * @param {Function} fn filtering function, that should return boolean value, saying to allow pass event or not
 *
 * @return {xs.reactive.Property}
 */
Property.prototype.filter = function (fn) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'filter - reactive is destroyed');

    //assert, that function is given
    assert.fn(fn, 'filter - given `$fn` is not a function', {
        $fn: fn
    });


    //create property
    return new me.constructor(filter, fn(me.value) ? me.value : undefined, [
        me,
        fn
    ]);
};

/**
 * Creates new property, that transforms incoming values via given transducer //TODO
 *
 * @method transduce
 *
 * @return {xs.reactive.Property}
 */
Property.prototype.transduce = function () {
};

/**
 * Creates new property, that throttles incoming values according to given interval
 *
 * @method throttle
 *
 * @param {Number} interval throttling interval
 *
 * @return {xs.reactive.Property}
 */
Property.prototype.throttle = function (interval) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'throttle - reactive is destroyed');

    //assert, that interval is a number
    assert.number(interval, 'throttle - given `$interval` is not a number', {
        $interval: interval
    });


    //create property
    return new me.constructor(throttle, me.value, [
        me,
        interval
    ]);
};

/**
 * Creates new property, that puts aside sending incoming values until given interval goes out
 *
 * @method debounce
 *
 * @param {Number} interval awaiting interval
 *
 * @return {xs.reactive.Property}
 */
Property.prototype.debounce = function (interval) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'debounce - reactive is destroyed');

    //assert, that interval is a number
    assert.number(interval, 'debounce - given `$interval` is not a number', {
        $interval: interval
    });


    //create property
    return new me.constructor(debounce, me.value, [
        me,
        interval
    ]);
};

function fromPromise(property, promise) {
    promise.then(function (data) {
        property.set({
            state: xs.core.Promise.Resolved,
            data: data
        });
    }, function (error) {
        property.set({
            state: xs.core.Promise.Rejected,
            error: error
        });
    }, function (progress) {
        property.set({
            state: xs.core.Promise.Pending,
            progress: progress
        });
    }).always(property.destroy);
}

function fromEvent(property, element, eventName) {

    var handler = function (event) {
        property.set(event);
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

function toStream(stream, property, sendCurrent) {
    if (sendCurrent) {
        var value = property.value;
        xs.nextTick(function () {
            stream.send(value);
        });
    }

    //on value - send
    property.on(function (event) {
        stream.send(event.data);
    });

    //on destroy - destroy
    property.on(stream.destroy, {
        target: xs.reactive.event.Destroy
    });
}

function map(property, source, fn) {

    //on value - set
    source.on(function (event) {
        property.set(fn(event.data));
    });

    //on destroy - destroy
    source.on(property.destroy, {
        target: xs.reactive.event.Destroy
    });
}

function filter(property, source, fn) {

    //on value - set
    source.on(function (event) {
        if (fn(event.data)) {
            property.set(event.data);
        }
    });

    //on destroy - destroy
    source.on(property.destroy, {
        target: xs.reactive.event.Destroy
    });
}

function throttle(property, source, interval) {
    var lastTime = -Infinity;

    //on value - change current
    source.on(function (event) {
        //get current time
        var time = (new Date()).valueOf();

        //if enough time passed - set value
        if (time - lastTime >= interval) {

            //update lastTime
            lastTime = time;

            //set property value
            property.set(event.data);
        }
    });

    //on destroy - destroy
    source.on(property.destroy, {
        target: xs.reactive.event.Destroy
    });
}

function debounce(property, source, interval) {
    var timeoutId;

    //on value - change current
    source.on(function (event) {

        //clear previous timeout
        clearTimeout(timeoutId);

        //set timeout for setting value
        timeoutId = setTimeout(function () {

            //set property value
            property.set(event.data);

            //if source is destroyed - destroy
            if (sourceDestroyed) {
                property.destroy();
            }
        }, interval);
    });

    var sourceDestroyed = false;

    //on destroy - destroy
    source.on(function () {

        //if timeout defined - awaiting initiated, needed delayed destroy
        if (xs.isDefined(timeoutId)) {

            //set flag, that source is destroyed
            sourceDestroyed = true;

            //else - can destroy property immediately
        } else {
            property.destroy();
        }
    }, {
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
 * @class XsReactivePropertyError
 */
function XsReactivePropertyError(message) {
    this.message = 'xs.reactive.Property::' + message;
}

XsReactivePropertyError.prototype = new Error();