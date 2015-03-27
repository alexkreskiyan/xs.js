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

    return new this(function (property, promise) {

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
    }, {
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