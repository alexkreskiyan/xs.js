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
     * xs.lang.String is private singleton, defining basic string operations.
     *
     * @class xs.lang.String
     *
     * @author Alex Kreskiyan <brutalllord@gmail.com>
     *
     * @singleton
     *
     * @private
     */
    var string = xs.String = new (function () {
        var me = this;

        /**
         * Translates string with given replacements
         *
         * For example:
         *
         *     console.log(xs.translate('My fox is small and brown. I love my small brown fox', {
         *         small: 'big',
         *         brown: 'black',
         *         fox: 'bear'
         *     }));
         *     //outputs:
         *     //My bear is big and black. I love my big black bear
         *
         *
         * @method translate
         *
         * @param {String} string translated string
         * @param {Object} replaces replaces hash, where keys are replaced strings and values are respective replaces
         *
         * @return {string} translated string
         */
        me.translate = function (string, replaces) {
            xs.each(replaces, function (to, from) {
                string = string.split(from).join(to);
            });
            return string;
        };
    });
    xs.extend(xs, string);
})(window, 'xs');