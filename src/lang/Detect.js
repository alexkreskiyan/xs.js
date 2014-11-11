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
         * For example:
         *
         *     //for Array
         *     var keys = xs.keys([
         *         1,
         *         2,
         *         3
         *     ]);
         *     console.log(keys); //[0, 1, 2]
         *
         *     //for Object
         *     var keys = xs.keys({
         *         a: 1,
         *         b: 2,
         *         c: 3
         *     });
         *     console.log(keys); //['a', 'b', 'c']
         *
         * @method getType
         * @param  {*} value given value
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
         * Return true if the passed arguments is a JavaScript Array, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        me.isArray = function (value) {
            return Array.isArray(value);
        };

        /**
         * Return true if the passed arguments is JavaScript Object, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        me.isObject = function (value) {
            return getType(value) == 'object';
        };

        /**
         * Return true if the passed arguments is JavaScript Object or JavaScript Array
         * @param  {*}  value
         * @return {Boolean}
         */
        me.isIterable = function (value) {
            var valueType = getType(value);
            return valueType == 'object' || valueType == 'array';
        };

        /**
         * Returns true if the passed value is a JavaScript 'primitive', a string,
         * number or boolean. False otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        me.isPrimitive = function (value) {
            var valueType = getType(value);
            return valueType !== 'object' && valueType !== 'array' && valueType !== 'function';
        };

        /**
         * Return true if the passed arguments is JavaScript Function, false otherwise.
         * @param  {*}  value [description]
         * @return {Boolean}       [description]
         */
        me.isFunction = function (value) {
            return typeof value == 'function';
        };

        /**
         * Return true if the passed arguments is JavaScript String, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        me.isString = function (value) {
            return typeof value == 'string';
        };

        /**
         * Return true if the passed arguments is JavaScript String which contain number
         * or JavaScript Number, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        me.isNumeric = function (value) {
            return !isNaN(parseFloat(value)) && isFinite(value) && !Array.isArray(value);
        };

        /**
         * Return true if the passed arguments is JavaScript Number, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        me.isNumber = function (value) {
            return typeof value == 'number';
        };

        /**
         * Return true if the passed arguments is null, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        me.isNull = function (value) {
            return value === null;
        };

        /**
         * Return true if the passed value is not 'undefined', false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        me.isDefined = function (value) {
            return typeof value != 'undefined';
        };

        /**
         * Return true if the passed value is JavaScript Boolean, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        me.isBoolean = function (value) {
            return typeof value == 'boolean';
        };

        /**
         * Return true if the passed value is empty, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
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