'use strict';

var log = new xs.log.Logger('xs.core.reactive.emitter.Stream');

var assert = new xs.core.Asserter(log, XsCoreReactiveEmitterStreamError);

//save reference to module
module.EmitterStream = function Emitter(reactive) {
    var me = this;

    //add send handler
    me.send = xs.bind(handleSend, reactive);

    //add destroy handler
    me.destroy = xs.bind(reactive.destroy, reactive);
};

//extend EmitterProperty from Emitter
xs.extend(module.EmitterStream, module.Emitter);

function handleSend(data, silent) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'send - reactive is destroyed');

    //verify, that reactive is not under construction
    assert.not(me.underConstruction, 'send - reactive is being constructed');

    if (silent) {

        return true;
    }

    //return send status
    return module.send(me.private.reactiveHandlers, data);
}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsCoreReactiveEmitterStreamError
 */
function XsCoreReactiveEmitterStreamError(message) {
    this.message = 'xs.core.reactive.emitter.Stream::' + message;
}

XsCoreReactiveEmitterStreamError.prototype = new Error();