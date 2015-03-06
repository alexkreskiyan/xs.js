'use strict';

var log = new xs.log.Logger('xs.reactive.property.Transformer');

var assert = new xs.core.Asserter(log, TransformerError);

if (!module.property) {
    module.property = {};
}

xs.reactive.property = {};

xs.reactive.property.Transformer = function (source) {
    console.log('constructor - transformer', source);
};

var Transformer = module.property.Transformer = xs.reactive.property.Transformer;

delete xs.reactive.property;

//extend Transformer from Property
xs.extend(Transformer, module.Property);

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
    this.message = 'xs.reactive.property.Transformer::' + message;
}

TransformerError.prototype = new Error();