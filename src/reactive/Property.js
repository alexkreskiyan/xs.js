'use strict';

var log = new xs.log.Logger('xs.reactive.Property');

var assert = new xs.core.Asserter(log, XsReactivePropertyError);

if (!xs.reactive) {
    xs.reactive = {};
}

var Reactive = module.Reactive;

var Property = xs.reactive.Property = function (generator, sources) {
    var me = this;

    var propertyGenerator = function (send) {
        return generator.apply(undefined, [
            function (data) {
                //send
                send(data);

                //set current value
                me.private.value = data;
            }
        ].concat(Array.prototype.slice.call(arguments, 1)));
    };

    Reactive.apply(me, [propertyGenerator].concat(Array.prototype.slice.call(arguments, 1)));
};

//extend Property from Reactive
xs.extend(Property, Reactive);

/**
 * Property current value
 *
 * @property value
 *
 * @readonly
 *
 * @type {Boolean}
 */
Object.defineProperty(Property.prototype, 'value', {
    get: function () {
        return this.private.value;
    },
    set: xs.noop,
    configurable: false,
    enumerable: true
});

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsReactivePropertyError
 */
function XsReactivePropertyError(message) {
    this.message = 'xs.reactive.Property::' + message;
}

XsReactivePropertyError.prototype = new Error();