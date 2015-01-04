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
     * xs.lang.Array is private singleton, defining basic Array operations.
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @private
     *
     * @class xs.lang.Array
     *
     * @singleton
     */
    xs.Array = new function () {
        var me = this;

        /**
         * Shuffles array items
         *
         * For example:
         *
         *     xs.shuffle([
         *         1,
         *         2,
         *         3
         *     ]);
         *
         * @method shuffle
         *
         * @param {Array} array shuffled array
         */
        me.shuffle = function (array) {
            xs.assert.array(array, 'shuffle - given "$array" is not array', {
                $array: array
            }, ArrayError);

            array.sort(function () {
                return Math.random() - 0.5;
            });
        };
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class ArrayError
     */
    function ArrayError(message) {
        this.message = 'xs.lang.Array::' + message;
    }

    ArrayError.prototype = new Error();

})(window, 'xs');