'use strict';

/**
 * xs.lang.Type is private singleton, defining basic language detection operations
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.lang.Type
 *
 * @singleton
 */
xs.Type = (function () {
    var me = {};

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
     * @return {Boolean} verification result
     */
    me.isObject = function (value) {
        if (value === null || Array.isArray(value)) {

            return false;
        }

        return typeof value === 'object';
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
     * @return {Boolean} verification result
     */
    me.isArray = function (value) {

        return Array.isArray(value);
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
     * @return {Boolean} verification result
     */
    me.isFunction = function (value) {

        return typeof value === 'function';
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
     * @return {Boolean} verification result
     */
    me.isString = function (value) {

        return typeof value === 'string';
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
     * @return {Boolean} verification result
     */
    me.isNumber = function (value) {

        return typeof value === 'number';
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
     * @return {Boolean} verification result
     */
    me.isBoolean = function (value) {

        return typeof value === 'boolean';
    };

    /**
     * Returns whether given value is a regexp instance
     *
     * For example:
     *
     *     console.log(xs.isRegExp(/a/)); //true
     *     console.log(xs.isRegExp(0)); //false
     *
     * @method isRegExp
     *
     * @param {*} value verified value
     *
     * @return {Boolean} verification result
     */
    me.isRegExp = function (value) {

        return value instanceof RegExp;
    };

    /**
     * Returns whether given value is an error instance.
     *
     * For example:
     *
     *     console.log(xs.isError(new Error)); //true
     *     console.log(xs.isError(0)); //false
     *
     * @method isError
     *
     * @param {*} value verified value
     *
     * @return {Boolean} verification result
     */
    me.isError = function (value) {

        return value instanceof Error;
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
     * @return {Boolean} verification result
     */
    me.isNull = function (value) {

        return value === null;
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
     * @return {Boolean} verification result
     */
    me.isIterable = function (value) {
        if (value === null) {

            return false;
        }

        return typeof value === 'object';
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
     * @return {Boolean} verification result
     */
    me.isPrimitive = function (value) {
        if (value === null) {

            return true;
        }

        var type = typeof value;

        return type !== 'object' && type !== 'function';
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
     * @return {Boolean} verification result
     */
    me.isNumeric = function (value) {

        return isFinite(value) && !Array.isArray(value) && !isNaN(parseFloat(value));
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
     * @return {Boolean} verification result
     */
    me.isDefined = function (value) {

        return typeof value !== 'undefined';
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
     * @return {Boolean} verification result
     */
    me.isEmpty = function (value) {
        if (value === null) {

            return true;
        }

        if (Array.isArray(value)) {

            return !value.length;
        }

        var type = typeof value;

        if (type === 'object') {

            return !Object.keys(value).length;
        } else if (type === 'string') {

            return !value.trim();
        } else if (type === 'number') {

            return !value;
        }

        return type !== 'function' && type !== 'boolean';
    };

    /**
     * Returns whether given value is an instance of some class
     *
     * For example:
     *
     *     console.log(xs.isInstance({})); //false
     *     console.log(xs.isInstance(nex xs.class.Base())); //true
     *
     * @method isInstance
     *
     * @param {*} value verified value
     *
     * @return {Boolean} verification result
     */
    me.isInstance = function (value) {
        if (value === null || Array.isArray(value)) {

            return false;
        }

        return (typeof value === 'object') && (typeof value.self === 'function') && (value.self.contractor === xs.Class);
    };

    /**
     * Returns whether given value is a contract
     *
     * For example:
     *
     *     console.log(xs.isContract(xs.class.Base)); //true
     *     console.log(xs.isContract(xs.noop)); //false
     *
     * @method isContract
     *
     * @param {*} value verified value
     *
     * @return {Boolean} verification result
     */
    me.isContract = function (value) {

        return ((typeof value === 'function') || this.isObject(value)) && (typeof value.contractor === 'function');
    };

    /**
     * Returns whether given value is a class
     *
     * For example:
     *
     *     console.log(xs.isClass(xs.class.Base)); //true
     *     console.log(xs.isClass(xs.interface.Base)); //false
     *
     * @method isClass
     *
     * @param {*} value verified value
     *
     * @return {Boolean} verification result
     */
    me.isClass = function (value) {

        return (typeof value === 'function') && (value.contractor === xs.Class);
    };

    /**
     * Returns whether given value is an interface
     *
     * For example:
     *
     *     console.log(xs.isInterface(xs.interface.Base)); //true
     *     console.log(xs.isInterface(xs.class.Base)); //false
     *
     * @method isInterface
     *
     * @param {*} value verified value
     *
     * @return {Boolean} verification result
     */
    me.isInterface = function (value) {

        return (typeof value === 'function') && (value.contractor === xs.Interface);
    };

    return me;
})();

//extend xs with type
Object.keys(xs.Type).forEach(function (method) {
    xs[ method ] = xs.Type[ method ];
});