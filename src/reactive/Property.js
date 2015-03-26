'use strict';

var log = new xs.log.Logger('xs.reactive.Property');

var assert = new xs.core.Asserter(log, XsReactivePropertyError);

if (!xs.reactive) {
    xs.reactive = {};
}

var Reactive = module.Reactive;

var Property = xs.reactive.Property = function (generator, value, sources) {
    var me = this;

    Reactive.apply(me, [
        generator,
        new module.EmitterProperty(me)
    ].concat(Array.prototype.slice.call(arguments, 2)));

    //set initial property value
    me.private.value = value;
};

//extend Property from Reactive
xs.extend(Property, Reactive);

/**
 * Creates reactive property from promise
 *
 * @static
 *
 * @method fromPromise
 *
 * @param {Object} promise reactive source promise
 *
 * @return {xs.reactive.Property}
 */
Property.fromPromise = function (promise) {

    //assert, that a promise given
    assert.ok(xs.core.Promise.isPromise(promise), 'fromPromise - given `$promise` is not a promise object', {
        $promise: promise
    });

    return new this(function (property, promise) {

        promise.then(function (data) {
            property.set({
                state: xs.core.Promise.Resolved,
                data: data
            });
        }, function (error) {
            property.set({
                state: xs.core.Promise.Rejected,
                error: error
            });
        }, function (progress) {
            property.set({
                state: xs.core.Promise.Pending,
                progress: progress
            });
        }).always(property.destroy);
    }, {
        state: xs.core.Promise.Pending,
        progress: undefined
    }, [ promise ]);
};

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