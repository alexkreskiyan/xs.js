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
 * set class pre-definition
 * @type {Object}
 */
'use strict';
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    var detect = xs.Detect = new (function () {

        /**
         * Return type passed arguments.
         * @param  {*} value
         * @return {string}
         */
        var getType = function (value) {
            var type = typeof value;
            if (value == null) {
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
        this.isArray = function (value) {
            return Array.isArray(value);
        };

        /**
         * Return true if the passed arguments is JavaScript Object, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        this.isObject = function (value) {
            return getType(value) == 'object';
        };

        /**
         * Return true if the passed arguments is JavaScript Object or JavaScript Array
         * @param  {*}  value
         * @return {Boolean}
         */
        this.isIterable = function (value) {
            var valueType = getType(value);
            return valueType == 'object' || valueType == 'array';
        };

        /**
         * Returns true if the passed value is a JavaScript 'primitive', a string,
         * number or boolean. False otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        this.isPrimitive = function (value) {
            var valueType = getType(value);
            return valueType !== 'object' && valueType !== 'array' && !this.isFunction(value);
        };

        /**
         * Return true if the passed arguments is JavaScript Function, false otherwise.
         * @param  {*}  value [description]
         * @return {Boolean}       [description]
         */
        this.isFunction = function (value) {
            return typeof value == 'function';
        };

        /**
         * Return true if the passed arguments is JavaScript Date, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        this.isDate = function (value) {
            return this.isObject(value) && value instanceof Date;
        };

        /**
         * Return true if the passed arguments is JavaScript String, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        this.isString = function (value) {
            return typeof value == 'string';
        };


        /**
         * Return true if the passed arguments is JavaScript String which contain number
         * or JavaScript Number, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        this.isNumeric = function (value) {
            return !isNaN(parseFloat(value)) && isFinite(value) && !this.isArray(value);
        };

        /**
         * Return true if the passed arguments is JavaScript Number, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        this.isNumber = function (value) {
            return typeof value == 'number';
        };

        /**
         * Return true if the passed arguments is null, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        this.isNull = function (value) {
            return value == null;
        };

        /**
         * Return true if the passed value is not 'undefined', false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        this.isDefined = function (value) {
            return typeof value != 'undefined';
        };

        /**
         * Return true if the passed value is JavaScript Boolean, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        this.isBoolean = function (value) {
            return typeof value == 'boolean';
        };

        /**
         * Return true if the passed value is empty, false otherwise.
         * @param  {*}  value
         * @return {Boolean}
         */
        this.isEmpty = function (value) {
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
    xs.Object.extend(xs, {
        isArray: detect.isArray,
        isObject: detect.isObject,
        isIterable: detect.isIterable,
        isPrimitive: detect.isPrimitive,
        isFunction: detect.isFunction,
        isDate: detect.isDate,
        isString: detect.isString,
        isNumeric: detect.isNumeric,
        isNumber: detect.isNumber,
        isNull: detect.isNull,
        isDefined: detect.isDefined,
        isBoolean: detect.isBoolean,
        isEmpty: detect.isEmpty
    });
})(window, 'xs');