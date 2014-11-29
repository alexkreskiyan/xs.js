/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function ( root, ns ) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    /**
     * xs.lang.List is private singleton, defining basic Object operations.
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @private
     *
     * @class xs.lang.Object
     *
     * @singleton
     */
    var object = xs.Object = new (function () {
        var me = this;

        // Create quick reference variables for speed access to core prototypes.
        var _slice = Function.prototype.call.bind(Array.prototype.slice);

        /**
         * Copies all properties from objects, passed as arguments to given obj
         *
         * For example:
         *
         *     var list = {
         *         x: 1
         *     };
         *     xs.extend(list, {
         *         x: 2,
         *         c: 1
         *     }, {
         *         c: 2,
         *         x: 3,
         *         a: 4
         *     });
         *     console.log(list);
         *     //outputs:
         *     //{
         *     //    x: 3,
         *     //    c: 2,
         *     //    a: 4
         *     //}
         *
         * @method extend
         *
         * @param {Object} object extended object
         */
        me.extend = function ( object ) {
            var adds = _slice(arguments, 1);

            xs.each(adds, function ( source ) {
                xs.isObject(source) && xs.each(source, function ( item, name ) {
                    object[name] = item;
                });
            });
        };

    });

    //extend xs with object
    object.extend(xs, object);
})(window, 'xs');