'use strict';

var log = new xs.log.Logger('xs.reactive.emitter.Property');

var assert = new xs.core.Asserter(log, XsReactiveEmitterPropertyError);

//save reference to module
module.EmitterProperty = function Emitter(reactive) {
    var me = this;

    //add set handler
    me.set = handleSet.bind(reactive);

    //add destroy handler
    me.destroy = reactive.destroy.bind(reactive);
};

//extend EmitterProperty from Emitter
xs.extend(module.EmitterProperty, module.Emitter);

function handleSet(data, silent) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'send - reactive is destroyed');

    //verify, that reactive is not under construction
    assert.not(me.underConstruction, 'send - reactive is being constructed');

    //set data and return true in silent mode, or if send is successful
    if (silent || module.send(me.private.reactiveHandlers, data)) {

        //set current value
        me.private.value = data;

        return true;
    }

    return false;
}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsReactiveEmitterPropertyError
 */
function XsReactiveEmitterPropertyError(message) {
    this.message = 'xs.reactive.emitter.Property::' + message;
}

XsReactiveEmitterPropertyError.prototype = new Error();