'use strict';

var log = new xs.log.Logger('xs.reactive.stream.Emitter');

var assert = new xs.core.Asserter(log, EmitterError);

if (!module.stream) {
    module.stream = {};
}

xs.reactive.stream = {};

xs.reactive.stream.Emitter = function (source) {
    console.log('constructor - emitter', source);
};

var Emitter = module.stream.Emitter = xs.reactive.stream.Emitter;

delete xs.reactive.stream;

//extend Emitter from Stream
xs.extend(Emitter, module.Stream);

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
    this.message = 'xs.reactive.stream.Emitter::' + message;
}

EmitterError.prototype = new Error();