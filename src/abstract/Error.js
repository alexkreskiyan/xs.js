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

    var error = xs.Error = new (function () {
        /**
         * Raises error with optional specified type
         * @param {String} message
         * @param {Function} type
         * @throws {Error|*}
         */
        var raise = function (message, type) {
            message = message || 'error';
            type = type || Error;
            throw new type(message);
        };
        /**
         * Handler for errors raising
         * @type {raise}
         */
        this.raise = raise;
        /**
         * Raises reference error
         * @param message
         * @throws {ReferenceError}
         */
        this.raiseReference = function (message) {
            raise(message, ReferenceError);
        };
        /**
         * Raises syntax error
         * @param message
         * @throws {SyntaxError}
         */
        this.raiseSyntax = function (message) {
            raise(message, SyntaxError);
        };
        /**
         * Raises type error
         * @param message
         * @throws {TypeError}
         */
        this.raiseType = function (message) {
            raise(message, TypeError);
        };
    });
    xs.extend(xs, {
        raiseError: error.raise,
        raiseReferenceError: error.raiseReference,
        raiseSyntaxError: error.raiseSyntax,
        raiseTypeError: error.raiseType
    });
})(window, 'xs');