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
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    /**
     * xs.lang.Array is private singleton, defining basic Array operations.
     *
     * @class xs.lang.Array
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     *
     * @singleton
     *
     * @private
     */
    var array = xs.Array = new (function () {
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
            array.sort(function () {
                return Math.random() - 0.5;
            });
        };
    });

    xs.extend(xs, array);
})(window, 'xs');