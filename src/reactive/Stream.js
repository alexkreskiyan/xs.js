'use strict';

var log = new xs.log.Logger('xs.reactive.Stream');

var assert = new xs.core.Asserter(log, StreamError);

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