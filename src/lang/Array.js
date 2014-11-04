/*!
 This file is core of xs.js 0.1

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
 * @class xs.Set
 * @singleton
 * @private
 * xs.Set is private singleton, defining basic set operations, for both Array and Object
 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    var array = xs.Array = new (function () {
        var me = this;
        /**
         * returns simple range array, produced according to given start, stop and step params
         * @param start
         * @param stop
         * @param step
         * @returns {Array}
         */
        me.range = function (start, stop, step) {
            //prepare arguments
            if (arguments.length <= 1) {
                stop = start || 0;
                start = 0;
            }
            step = arguments[2] || 1;
            //set params
            var length = Math.max(Math.ceil((stop - start) / step), 0);
            var idx = 0;
            var range = new Array(length);
            //fill range
            while (idx <= length) {
                range[idx++] = start;
                start += step;
            }
            return range;
        };
        me.toObject = function (arr) {
            var object = {};
            _each(arr, function (index, value) {
                object[index] = value;
            });
            return object;
        }
    });
    xs.extend(xs, {
        range:   array.range
    });
})(window, 'xs');