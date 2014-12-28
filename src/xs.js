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
(function (root, ns) {

    'use strict';

    /**
     * Framework entry point
     *
     * @class xs
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @singleton
     */
    root[ns] = new function () {
        var me = this;

        /**
         * Returns unique id
         *
         * @method uid
         *
         * @return {Number} unique id
         */
        me.uid = function () {
            return Math.round(Math.random() * 10e10);
        };
    };
})(window, 'xs');