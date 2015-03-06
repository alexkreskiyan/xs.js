'use strict';

var log = new xs.log.Logger('xs.reactive.stream.Transformer');

var assert = new xs.core.Asserter(log, TransformerError);

if (!module.stream) {
    module.stream = {};
}

xs.reactive.stream = {};

xs.reactive.stream.Transformer = function (source) {
    console.log('constructor - transformer', source);
};

var Transformer = module.stream.Transformer = xs.reactive.stream.Transformer;

delete xs.reactive.stream;

//extend Transformer from Stream
xs.extend(Transformer, module.Stream);

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class TransformerError
 */
function TransformerError(message) {
    this.message = 'xs.reactive.stream.Transformer::' + message;
}

TransformerError.prototype = new Error();