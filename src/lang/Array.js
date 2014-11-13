/*!
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact:  http://annium.com/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://annium.com/contact.

 */
/**
 * @class xs.lang.Array
 * @singleton
 * @private
 *
 * xs.lang.Array is private singleton, defining basic Array operations.
 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    var array = new (function () {
        var me = this;

        /**
         * Returns first item of array
         *
         * For example:
         *
         *     var array = [
         *         {
         *             x: 1,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 1
         *         },
         *         {
         *             x: 1,
         *             y: 1
         *         }
         *     ];
         *     console.log(xs.first(array));
         *     //outputs:
         *     // {x: 1, y: 2}, reference to array[0] respectively
         *
         * @method first
         *
         * @param {Array} array
         *
         * @returns {*} first item, undefined if array is empty
         */
        me.first = function (array) {
            return array[0];
        };

        /**
         * Returns last item of array
         *
         * For example:
         *
         *     var array = [
         *         {
         *             x: 1,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 1
         *         },
         *         {
         *             x: 1,
         *             y: 1
         *         }
         *     ];
         *     console.log(xs.last(array));
         *     //outputs:
         *     // {x: 1, y: 1}, reference to array[3] respectively
         *
         * @method last
         *
         * @param {Array} array
         *
         * @returns {*} last item, undefined if array is empty
         */
        me.last = function (array) {
            return array[array.length - 1];
        };

        /**
         * Shifts and returns first item from array
         *
         * For example:
         *
         *     var array = [
         *         {
         *             x: 1,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 1
         *         },
         *         {
         *             x: 1,
         *             y: 1
         *         }
         *     ];
         *     console.log(xs.shift(array));
         *     //outputs:
         *     // {x: 1, y: 2}, reference to array[0] respectively
         *     console.log(array);
         *     //outputs:
         *     //[
         *     //    {
         *     //        x: 2,
         *     //        y: 2
         *     //    },
         *     //    {
         *     //        x: 2,
         *     //        y: 1
         *     //    },
         *     //    {
         *     //        x: 1,
         *     //        y: 1
         *     //    }
         *     //];
         *
         * @method shift
         *
         * @param {Array} array
         *
         * @returns {*} First item of array
         */
        me.shift = function (array) {
            var item = array[0];
            array.splice(0, 1);
            return item;
        };

        /**
         * Pops and returns last item from array
         *
         * For example:
         *
         *     var array = [
         *         {
         *             x: 1,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 2
         *         },
         *         {
         *             x: 2,
         *             y: 1
         *         },
         *         {
         *             x: 1,
         *             y: 1
         *         }
         *     ];
         *     console.log(xs.pop(array));
         *     //outputs:
         *     // {x: 1, y: 1}, reference to array[3] respectively
         *     console.log(array);
         *     //outputs:
         *     //[
         *     //    {
         *     //        x: 1,
         *     //        y: 2
         *     //    },
         *     //    {
         *     //        x: 2,
         *     //        y: 2
         *     //    },
         *     //    {
         *     //        x: 2,
         *     //        y: 1
         *     //    }
         *     //];
         *
         * @method pop
         *
         * @param {Array} array
         *
         * @returns {*} Last item of array
         */
        me.pop = function (array) {
            var item = array[array.length - 1];
            array.splice(-1, 1);
            return item;
        };

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
            array.sort(function () {
                return Math.random() - 0.5;
            });
        };

    });
    xs.extend(xs, array);
})(window, 'xs');