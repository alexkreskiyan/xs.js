/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    var log = new xs.log.Logger('xs.interface.Interface');

    var assert = new xs.core.Asserter(log, ObjectError);

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
    var object = xs.Object = (function () {
        var me = {};

        // Create quick reference variables for speed access to core prototypes.
        var slice = Function.prototype.call.bind(Array.prototype.slice);

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
        me.extend = function (object) {

            //assert that index is in bounds
            assert.object(object, 'extend - given "$object" is not object', {
                $object: object
            });

            var adds = slice(arguments, 1), addsLength = adds.length;

            //iterate over add-ons
            for (var i = 0; i < addsLength; i++) {
                var source = adds[i];

                //continue if source is not object
                if (!xs.isObject(source)) {
                    continue;
                }

                var sourceKeys = Object.keys(source), sourceLength = sourceKeys.length;

                for (var j = 0; j < sourceLength; j++) {
                    var key = sourceKeys[j];
                    object[key] = source[key];
                }
            }
        };

        return me;
    })();

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ObjectError
     */
    function ObjectError(message) {
        this.message = 'xs.lang.Object::' + message;
    }

    ObjectError.prototype = new Error();

    //extend xs with object
    Object.keys(object).forEach(function (key) {
        xs[key] = object[key];
    });
})(window, 'xs');