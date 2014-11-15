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
 * @class xs.lang.Detect
 * @singleton
 * @private
 *
 * xs.lang.Detect is private singleton, defining basic language detection operations
 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    var detect = new (function () {
        var me = this;

        /**
         * Returns type of passed value.
         *
         * @ignore
         *
         * @method getType
         *
         * @param {*} value given value
         *
         * @return {string} value's type
         */
        var getType = function (value) {
            var type = typeof value;
            if (value === null) {
                type = 'null';
            } else if (Array.isArray(value)) {
                type = 'array';
            }
            return type;
        };

        /**
         * Returns whether given value is array
         *
         * For example:
         *
         *     console.log(xs.isArray([])); //true
         *     console.log(xs.isArray({})); //false
         *
         * @method isArray
         *
         * @param {*} value verified value
         *
         * @return {boolean} verification result
         */
        me.isArray = function (value) {
            return Array.isArray(value);
        };

        /**
         * Returns whether given value is object
         *
         * For example:
         *
         *     console.log(xs.isObject(null)); //false
         *     console.log(xs.isObject({})); //true
         *
         * @method isObject
         *
         * @param {*} value verified value
         *
         * @return {boolean} verification result
         */
        me.isObject = function (value) {
            return getType(value) == 'object';
        };

        /**
         * Returns whether given value is iterable: is array or object
         *
         * For example:
         *
         *     console.log(xs.isIterable(null)); //false
         *     console.log(xs.isIterable({})); //true
         *     console.log(xs.isIterable([])); //true
         *
         * @method isIterable
         *
         * @param {*} value verified value
         *
         * @return {boolean} verification result
         */
        me.isIterable = function (value) {
            var valueType = getType(value);
            return valueType == 'object' || valueType == 'array';
        };

        /**
         * Returns whether given value is a 'primitive', a string, number or boolean.
         *
         * For example:
         *
         *     console.log(xs.isPrimitive(null)); //true
         *     console.log(xs.isPrimitive({})); //false
         *     console.log(xs.isPrimitive([])); //false
         *
         * @method isPrimitive
         *
         * @param {*} value verified value
         *
         * @return {boolean} verification result
         */
        me.isPrimitive = function (value) {
            var valueType = getType(value);
            return valueType !== 'object' && valueType !== 'array' && valueType !== 'function';
        };

        /**
         * Returns whether given value is function.
         *
         * For example:
         *
         *     console.log(xs.isFunction(new Function())); //true
         *     console.log(xs.isFunction({})); //false
         *
         * @method isFunction
         *
         * @param {*} value verified value
         *
         * @return {boolean} verification result
         */
        me.isFunction = function (value) {
            return typeof value == 'function';
        };

        /**
         * Returns whether given value is string.
         *
         * For example:
         *
         *     console.log(xs.isString('4')); //true
         *     console.log(xs.isString(4)); //false
         *
         * @method isString
         *
         * @param {*} value verified value
         *
         * @return {boolean} verification result
         */
        me.isString = function (value) {
            return typeof value == 'string';
        };

        /**
         * Returns whether given value number, or string, which contains number
         *
         * For example:
         *
         *     console.log(xs.isNumeric('4')); //true
         *     console.log(xs.isNumeric(4)); //true
         *     console.log(xs.isNumeric('a')); //false
         *
         * @method isNumeric
         *
         * @param {*} value verified value
         *
         * @return {boolean} verification result
         */
        me.isNumeric = function (value) {
            return !isNaN(parseFloat(value)) && isFinite(value) && !Array.isArray(value);
        };

        /**
         * Returns whether given value is number.
         *
         * For example:
         *
         *     console.log(xs.isNumber(4)); //true
         *     console.log(xs.isNumber('4')); //false
         *
         * @method isNumber
         *
         * @param {*} value verified value
         *
         * @return {boolean} verification result
         */
        me.isNumber = function (value) {
            return typeof value == 'number';
        };

        /**
         * Returns whether given value is null.
         *
         * For example:
         *
         *     console.log(xs.isNull(null)); //true
         *     console.log(xs.isNull(0)); //false
         *
         * @method isNull
         *
         * @param {*} value verified value
         *
         * @return {boolean} verification result
         */
        me.isNull = function (value) {
            return value === null;
        };

        /**
         * Returns whether given value is not defined
         *
         * For example:
         *
         *     console.log(xs.isDefined(null)); //true
         *     console.log(xs.isDefined(undefined)); //false
         *
         * @method isDefined
         *
         * @param {*} value verified value
         *
         * @return {boolean} verification result
         */
        me.isDefined = function (value) {
            return typeof value != 'undefined';
        };

        /**
         * Returns whether given value is boolean
         *
         * For example:
         *
         *     console.log(xs.isBoolean(false)); //true
         *     console.log(xs.isBoolean(0)); //false
         *
         * @method isBoolean
         *
         * @param {*} value verified value
         *
         * @return {boolean} verification result
         */
        me.isBoolean = function (value) {
            return typeof value == 'boolean';
        };

        /**
         * Returns whether given value is boolean
         *
         * For example:
         *
         *     console.log(xs.isEmpty({})); //true
         *     console.log(xs.isEmpty({a:1})); //false
         *     console.log(xs.isEmpty([])); //true
         *     console.log(xs.isEmpty([1])); //false
         *     console.log(xs.isEmpty('')); //true
         *     console.log(xs.isEmpty('a')); //false
         *     console.log(xs.isEmpty(0)); //true
         *     console.log(xs.isEmpty(-1)); //false
         *     console.log(xs.isEmpty(undefined)); //true
         *     console.log(xs.isEmpty(null)); //true
         *     console.log(xs.isEmpty(false)); //false
         *     console.log(xs.isEmpty(function(){})); //false
         *
         * @method isEmpty
         *
         * @param {*} value verified value
         *
         * @return {boolean} verification result
         */
        me.isEmpty = function (value) {
            var type = getType(value);
            if (type == 'object') {
                return !Object.keys(value).length;
            } else if (type == 'array') {
                return !value.length;
            } else if (type == 'string') {
                return !value.trim();
            } else if (type == 'number') {
                return value == 0;
            } else {
                return type != 'function' && type != 'boolean';
            }
        };
    });
    Object.keys(detect).forEach(function (method) {
        xs[method] = detect[method];
    });
})(window, 'xs');