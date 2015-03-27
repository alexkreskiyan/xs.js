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

    return new this(function (stream, promise) {
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
    }, [ promise ]);
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