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

    /**
     * xs.lang.List is private singleton, defining basic list operations, for both Array and Object.
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @private
     *
     * @class xs.lang.List
     *
     * @singleton
     */
    var list = xs.List = new function () {
        var me = this;

        // Create quick reference variables for speed access to core prototypes.
        var _slice = Function.prototype.call.bind(Array.prototype.slice);

        /**
         * Returns shallow copy of list
         *
         * For example:
         *
         *     //for Array
         *     xs.clone([
         *         1,
         *         2,
         *         3
         *     ]);
         *
         *     //for Object
         *     xs.clone({
         *         a: 1,
         *         c: 2,
         *         b: 3
         *     });
         *
         * @method clone
         *
         * @param {Array|Object} list copied list
         *
         * @return {Array|Object} list shallow copy
         */
        me.clone = function (list) {
            //assert that list either array or object
            xs.assert.ok(xs.isArray(list) || xs.isObject(list), 'clone - given list "$list" is nor array neither object', {
                $list: list
            }, ListError);

            //handle array list
            if (xs.isArray(list)) {

                return _slice(list);
            }

            //init variables
            var copy = {}, index, keysLength, keys = Object.keys(list), key;
            keysLength = keys.length;

            //copy values
            for (index = 0; index < keysLength; index++) {
                key = keys[index];
                copy[key] = list[key];
            }

            return copy;
        };
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ListError
     */
    function ListError(message) {
        this.message = 'xs.lang.List::' + message;
    }

    ListError.prototype = new Error();


    //extend xs with list
    xs.extend(xs, list);
})(window, 'xs');