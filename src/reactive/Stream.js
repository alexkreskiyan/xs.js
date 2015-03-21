'use strict';

var log = new xs.log.Logger('xs.reactive.Stream');

var assert = new xs.core.Asserter(log, XsReactiveStreamError);

if (!xs.reactive) {
    xs.reactive = {};
}

var Reactive = module.Reactive;

var Stream = xs.reactive.Stream = function (generator, sources) {
    var me = this;

    Reactive.apply(me, arguments);
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

    return new this(function (send, end, promise) {
        promise.then(function (data) {
            send({
                state: xs.core.Promise.Resolved,
                data: data
            });
        }, function (error) {
            send({
                state: xs.core.Promise.Rejected,
                error: error
            });
        }, function (progress) {
            send({
                state: xs.core.Promise.Pending,
                progress: progress
            });
        }).always(end);
    }, [promise]);
};

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