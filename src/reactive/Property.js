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

    var descendant = new xs.reactive.Stream(xs.noop);
    var send = descendant.private.emitter.send;

    if (sendCurrent) {
        var value = me.value;
        xs.nextTick(function () {
            send(value);
        });
    }

    module.defineInheritanceRelations(me, descendant, send, xs.bind(descendant.destroy, descendant));

    return descendant;
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

    var descendant = new me.constructor(xs.noop);
    var setValue = descendant.private.emitter.set;

    module.defineInheritanceRelations(me, descendant, function (data) {
        setValue(fn(data));
    }, xs.bind(descendant.destroy, descendant));

    return descendant;
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

    var descendant = new me.constructor(xs.noop);
    var setValue = descendant.private.emitter.set;

    var dataHandler;

    //filter by event if event given
    if (module.isEvent(fn)) {
        dataHandler = function (data) {
            if (data !== undefined && data !== null && data.constructor === fn) {
                setValue(data);
            }
        };
    } else {
        dataHandler = function (data) {
            if (fn(data)) {
                setValue(data);
            }
        };
    }

    module.defineInheritanceRelations(me, descendant, dataHandler, xs.bind(descendant.destroy, descendant));

    return descendant;
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

    var descendant = new me.constructor(xs.noop);
    var setValue = descendant.private.emitter.set;

    var lastTime = -Infinity;

    module.defineInheritanceRelations(me, descendant, function (data) {
        //get current time
        var time = (new Date()).valueOf();

        //if enough time passed - set value
        if (time - lastTime >= interval) {

            //update lastTime
            lastTime = time;

            //set property value
            setValue(data);
        }
    }, xs.bind(descendant.destroy, descendant));

    return descendant;
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

    var descendant = new me.constructor(xs.noop);
    var setValue = descendant.private.emitter.set;

    var timeoutId;
    var sourceDestroyed = false;

    module.defineInheritanceRelations(me, descendant, function (data) {

        //clear previous timeout
        clearTimeout(timeoutId);

        //set timeout for setting value
        timeoutId = setTimeout(function () {

            //set property value
            setValue(data);

            //if source is destroyed - destroy
            if (sourceDestroyed) {
                descendant.destroy();
            }
        }, interval);
    }, function () {

        //if timeout defined - awaiting initiated, needed delayed destroy
        if (xs.isDefined(timeoutId)) {

            //set flag, that source is destroyed
            sourceDestroyed = true;

            //else - can destroy stream immediately
        } else {
            descendant.destroy();
        }
    });

    return descendant;
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