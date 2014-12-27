/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    //framework shorthand
    var xs = root[ns];

    //define xs.core
    xs.core || (xs.core = {});

    /**
     * xs.core.Assert is singleton, providing functionality to perform asserts for widely used verifications
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @private
     *
     * @class xs.core.Assert
     *
     * @alternateClassName xs.assert
     *
     * @singleton
     */
    xs.assert = xs.core.Assert = new (function () {
        var me = this;

        /**
         * Raises error of given type with given
         *
         * @ignore
         *
         * @private
         *
         * @method raise
         *
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         *
         * @throws {Error}
         */
        var _raise = function (Exception, message, vars) {
            //default Exception to Error
            xs.isFunction(Exception) || (Exception = Error);

            //throw Exception
            if (xs.isObject(vars)) {
                throw new Exception(xs.translate(message, vars));
            } else {
                throw new Exception(message);
            }
        };

        /**
         * Verifies, that two values are same (==)
         *
         * For example:
         *
         *     xs.same(1, '1'); //is ok
         *
         * @method same
         *
         * @param {*} given given value
         * @param {*} expected given value
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.same = function (given, expected, Exception, message, vars) {
            xs.isString(message) || (message = 'Given "' + given + '" is not same to expected "' + expected + '"');

            //assert
            given == expected || _raise(Exception, message, vars);
        }
    });

})(window, 'xs');