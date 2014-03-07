/**
 This file is core of xs.js 0.1

 Copyright (c) 2013-2014, Coos Inc

 Contact:  http://coos.me/contact

 GNU General Public License Usage
 This file may be used under the terms of the GNU General Public License version 3.0 as
 published by the Free Software Foundation and appearing in the file LICENSE included in the
 packaging of this file.

 Please review the following information to ensure the GNU General Public License version 3.0
 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

 If you are unsure which license is appropriate for your use, please contact the sales department
 at http://coos.me/contact.

 */
(function (namespace) {
    /**
     * define framework constructor
     */
    var XS = function () {
        /**
         * Current version
         */
        this.VERSION = '0.1.0';

        /**
         * modules container
         * @type {{}}
         * @private
         */
        var __modules = {};

        /**
         * checks whether module already defined
         * @param module
         * @returns {boolean}
         */
        this.hasModule = function (module) {
            return __modules.hasOwnProperty(module);
        };
        this.module = function (config) {
            //check config and throw error if not ok
            if (!this.isObject(config) || !this.isString(config.name)) {
                throw 'module config is bad';
            }
            if (this.hasModule(config.name)) {
                throw 'module "' + config.name + '" already defined';
            }
        };
        this.init = function (module) {

        };
        /**
         * Basic checks
         */
        /**
         * Checks that value is null
         * @param value
         * @returns {boolean}
         */
        this.isNull = function (value) {
            return value === null;
        };
        /**
         * Checks that value is undefined
         * @param value
         * @returns {boolean}
         */
        this.isUndefined = function (value) {
            return typeof value == 'undefined';
        };
        /**
         * Checks that value is function
         * @param value
         * @returns {boolean}
         */
        this.isFunction = function (value) {
            return typeof value == 'function';
        };
        /**
         * Checks that value is object
         * @param value
         * @returns {boolean}
         */
        this.isObject = function (value) {
            return typeof value == 'object';
        };
        /**
         * Checks that value is array
         * @param value
         * @returns {boolean}
         */
        this.isArray = function (value) {
            return Array.isArray(value);
        };
        /**
         * Checks that value is string
         * @param value
         * @returns {boolean}
         */
        this.isString = function (value) {
            return typeof value == 'string';
        };
        /**
         * Checks that value is number
         * @param value
         * @returns {boolean}
         */
        this.isNumber = function (value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        };
        /**
         * Checks that value is boolean
         * @param value
         * @returns {boolean}
         */
        this.isBoolean = function (value) {
            return typeof value == 'boolean';
        };
    };

    //create framework instance
    var xs = new XS();
    // Export the xs object for **Node.js**, else export to context.
    if (typeof exports !== 'undefined') {
        exports[namespace] = xs;
    } else {
        this[namespace] = xs;
    }
}).call(window, 'xs');