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
/**
 * array class pre-definition
 * @type {}
 * @private
 */
'use strict';
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    var string = xs.String = new (function () {
        var me = this;
        me.translate = function (string, replaces) {
            xs.Object.each(replaces, function (to, from) {
                string = string.split(from).join(to);
            });
            return string;
        };
    });
    xs.Object.extend(xs, {
        translate: string.translate
    });
})(window, 'xs');