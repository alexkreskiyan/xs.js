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
     * xs.lang.List is private singleton, defining basic Object operations.
     *
     * @class xs.lang.Object
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     *
     * @singleton
     *
     * @private
     */
    var object = xs.Object = new (function () {
        var me = this;

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
            var adds = slice(arguments, 1);
            xs.each(adds, function (source) {
                xs.isObject(source) && xs.each(source, function (item, name) {
                    object[name] = item;
                });
            });
        };

    });

    object.extend(xs, object);
})(window, 'xs');