'use strict';

var log = new xs.log.Logger('xs.reactive.Stream');

var assert = new xs.core.Asserter(log, StreamError);

if (!xs.reactive) {
    xs.reactive = {};
}

var Stream = xs.reactive.Stream = module.Stream = function (source) {
    assert.ok((source instanceof Stream) || xs.isFunction(source), 'constructor - given source `$source` is not a stream neither an emitter', {
        $source: source
    });

    return xs.isFunction(source) ? new module.stream.Emitter(source) : new module.stream.Transformer(source);
};

//extend Stream from Reactive
xs.extend(module.Stream, module.Reactive);

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