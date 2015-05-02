/**
 * xs.data.Collection is framework class, that is widely used for internal classes' collections
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.Collection
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Collection', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data';

    Class.mixins.observable = 'xs.event.Observable';

    Class.mixins.enumerable = 'xs.data.Enumerable';

    /**
     * xs.data.Collection constructor
     *
     * @constructor
     *
     * @param {Array|Object} [values] collection source
     * @param {Function} [type] for typed collection, constructor, mixin or interface, each value must match.
     * Type can be xs.Interface, xs.Class or any other function:
     *
     * - if given xs.Interface, all values are verified to be instances of classes, that implement given interface
     * - if given xs.Class, all values are verified to be instances of that class
     * - otherwise, all values are verified to be instances of given function
     *
     * If no type given, collection may contain any value
     */
    Class.constructor = function (values, type) {
        var me = this;

        //call observable constructor
        self.mixins.observable.call(me, xs.noop);

        //call enumerable constructor
        self.mixins.enumerable.apply(me, arguments);
    };

    /**
     * Destroys collection.
     *
     * @method destroy
     */
    Class.method.destroy = function () {
        var me = this;

        //call Enumerable.destroy
        self.mixins.enumerable.prototype.destroy.call(me);

        //call Observable.destroy
        self.mixins.observable.prototype.destroy.call(me);

        //call parent destroy
        self.parent.prototype.destroy.call(me);
    };

});