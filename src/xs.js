/**
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
'use strict';
/**
 * @class xs
 * @singleton
 */
(function (root, ns) {

    //create framework
    var xs = new (function () {
        var me = this;
        /**
         * @method
         * @private
         * Represents empty function. is used internally
         */
        me.emptyFn = function () {
        };
        /**
         * @method
         * Returns unique id
         * @returns {Number} unique id
         */
        me.uid = function () {
            return Math.round(Math.random() * 10 ^ 10);
        }
    });
    //save framework in root
    root[ns] = xs;
})(window, 'xs');