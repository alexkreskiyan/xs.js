'use strict';

var log = new xs.log.Logger('xs.reactive.Property');

var assert = new xs.core.Asserter(log, XsReactivePropertyError);

var Reactive = module.Reactive;

var Property = xs.reactive.Property = function (generator, value, sources) {
    var me = this;

    if (arguments.length < 3) {
        Reactive.call(me, generator, new module.emitter.Property(me));
    } else {
        Reactive.call(me, generator, new module.emitter.Property(me), sources);
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

function fromPromise(promise) {
    var me = this;

    promise.then(function (data) {
        me.set({
            state: xs.core.Promise.Resolved,
            data: data
        });
    }, function (error) {
        me.set({
            state: xs.core.Promise.Rejected,
            error: error
        });
    }, function (progress) {
        me.set({
            state: xs.core.Promise.Pending,
            progress: progress
        });
    }).always(me.destroy);
}

function fromEvent(element, eventName) {
    var me = this;

    var handler = function (event) {
        me.set(event);
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

function toStream(property, sendCurrent) {
    var me = this;

    if (sendCurrent) {
        var value = property.value;
        xs.nextTick(function () {
            me.send(value);
        });
    }

    //on value - send
    property.on(me.send);

    //on destroy - destroy
    property.on(xs.reactive.event.Destroy, me.destroy);
}

function map(source, fn) {
    var me = this;

    //on value - set
    source.on(function (data) {
        me.set(fn(data));
    });

    //on destroy - destroy
    source.on(xs.reactive.event.Destroy, me.destroy);
}

function filter(source, fn) {
    var me = this;

    //on value - set
    source.on(function (data) {
        if (fn(data)) {
            me.set(data);
        }
    });

    //on destroy - destroy
    source.on(xs.reactive.event.Destroy, me.destroy);
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

            //set property value
            me.set(data);
        }
    });

    //on destroy - destroy
    source.on(xs.reactive.event.Destroy, me.destroy);
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

            //set property value
            me.set(data);

            //if source is destroyed - destroy
            if (sourceDestroyed) {
                me.destroy();
            }
        }, interval);
    });

    var sourceDestroyed = false;

    //on destroy - destroy
    source.on(xs.reactive.event.Destroy, function () {

        //if timeout defined - awaiting initiated, needed delayed destroy
        if (xs.isDefined(timeoutId)) {

            //set flag, that source is destroyed
            sourceDestroyed = true;

            //else - can destroy property immediately
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
 * @class XsReactivePropertyError
 */
function XsReactivePropertyError(message) {
    this.message = 'xs.reactive.Property::' + message;
}

XsReactivePropertyError.prototype = new Error();