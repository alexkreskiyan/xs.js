'use strict';

var log = new xs.log.Logger('xs.reactive.Property');

var assert = new xs.core.Asserter(log, PropertyError);

if (!xs.reactive) {
    xs.reactive = {};
}

var Property = xs.reactive.Property = module.Property = function (source) {
    assert.ok((source instanceof Property) || xs.isFunction(source), 'constructor - given source `$source` is not a property neither an emitter', {
        $source: source
    });

    return xs.isFunction(source) ? new module.property.Emitter(source) : new module.property.Transformer(source);
};

//extend Property from Reactive
xs.extend(module.Property, module.Reactive);

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class PropertyError
 */
function PropertyError(message) {
    this.message = 'xs.reactive.Property::' + message;
}

PropertyError.prototype = new Error();