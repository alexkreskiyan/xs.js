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

    var assert = new xs.core.Asserter(log, ArrayError);

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
    xs.Array = (function () {
        var me = {};

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
            assert.array(array, 'shuffle - given `$array` is not array', {
                $array: array
            });

            array.sort(function () {
                return Math.random() - 0.5;
            });
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
     * @class ArrayError
     */
    function ArrayError(message) {
        this.message = 'xs.lang.Array::' + message;
    }

    ArrayError.prototype = new Error();

})(window, 'xs');