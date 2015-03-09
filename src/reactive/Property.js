'use strict';

var log = new xs.log.Logger('xs.reactive.Property');

var assert = new xs.core.Asserter(log, PropertyError);

if (!xs.reactive) {
    xs.reactive = {};
}

var Reactive = module.Reactive;

var Property = xs.reactive.Property = function (generator, sources) {
    var me = this;

    Reactive.apply(me, arguments);
};

//extend Property from Reactive
xs.extend(Property, Reactive);

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