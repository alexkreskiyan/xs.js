'use strict';

var log = new xs.log.Logger('xs.reactive.emitter.Property');

var assert = new xs.core.Asserter(log, XsReactiveEmitterPropertyError);

//save reference to module
module.emitter.Property = function Emitter(reactive) {
    var me = this;

    //add set handler
    me.set = xs.bind(handleSet, reactive);

    //add destroy handler
    me.destroy = xs.bind(reactive.destroy, reactive);
};

//extend emitter.Property from emitter.Emitter
xs.extend(module.emitter.Property, module.emitter.Emitter);

function handleSet(data, silent) {
    var me = this;

    //assert, that reactive is not destroyed
    assert.not(me.isDestroyed, 'send - reactive is destroyed');

    //verify, that reactive is not under construction
    assert.not(me.underConstruction, 'send - reactive is being constructed');

    //set data and return true in silent mode, or if send is successful
    if (silent || module.send(me.private.handlers, data)) {

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