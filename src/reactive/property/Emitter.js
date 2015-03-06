'use strict';

var log = new xs.log.Logger('xs.reactive.property.Emitter');

var assert = new xs.core.Asserter(log, EmitterError);

if (!module.property) {
    module.property = {};
}

xs.reactive.property = {};

xs.reactive.property.Emitter = function (source) {
    console.log('constructor - emitter', source);
};

var Emitter = module.property.Emitter = xs.reactive.property.Emitter;

delete xs.reactive.property;

//extend Transformer from Stream
xs.extend(Emitter, module.Property);

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class EmitterError
 */
function EmitterError(message) {
    this.message = 'xs.reactive.property.Emitter::' + message;
}

EmitterError.prototype = new Error();