/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
(function (root, ns) {

    'use strict';

    //framework shorthand
    var xs = root[ns];

    //define xs.core
    if (!xs.core) {
        xs.core = {};
    }

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
    xs.assert = xs.core.Assert = (function () {
        var me = {};

        /**
         * Verifies, that two values are equal (===)
         *
         * For example:
         *
         *     xs.equal(1, '1');
         *
         * @method equal
         *
         * @param {*} given given value
         * @param {*} expected given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.equal = function (given, expected, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = 'Given "' + given + '" is not same to expected "' + expected + '"';
            }

            //assert
            if (given !== expected) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given expression if true-like
         *
         * For example:
         *
         *     xs.assert.ok(1==1);
         *
         * @method ok
         *
         * @param {Boolean} expression evaluated expression value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.ok = function (expression, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = 'Expression failed';
            }

            //assert
            if (!expression) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given expression if false-like
         *
         * For example:
         *
         *     xs.assert.not(1==2);
         *
         * @method not
         *
         * @param {Boolean} expression evaluated expression value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.not = function (expression, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = 'Expression succeed';
            }

            //assert
            if (expression) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is object
         *
         * For example:
         *
         *     xs.assert.object({});
         *
         * @method object
         *
         * @param {Object} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        var _object = me.object = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not object';
            }

            //assert
            if (!xs.isObject(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is array
         *
         * For example:
         *
         *     xs.assert.array([]);
         *
         * @method array
         *
         * @param {Array} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.array = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not array';
            }

            //assert
            if (!xs.isArray(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is function
         *
         * For example:
         *
         *     xs.assert.fn(xs.emptyFn);
         *
         * @method fn
         *
         * @param {Function} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        var _fn = me.fn = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not function';
            }

            //assert
            if (!xs.isFunction(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is string
         *
         * For example:
         *
         *     xs.assert.string('');
         *
         * @method string
         *
         * @param {String} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.string = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not string';
            }

            //assert
            if (!xs.isString(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is number
         *
         * For example:
         *
         *     xs.assert.number(1);
         *
         * @method number
         *
         * @param {Number} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.number = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not number';
            }

            //assert
            if (!xs.isNumber(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is boolean
         *
         * For example:
         *
         *     xs.assert.boolean(true);
         *
         * @method boolean
         *
         * @param {Boolean} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.boolean = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not boolean';
            }

            //assert
            if (!xs.isBoolean(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is regular expression
         *
         * For example:
         *
         *     xs.assert.regExp(/a/);
         *
         * @method regExp
         *
         * @param {RegExp} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.regExp = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not regular expression';
            }

            //assert
            if (!xs.isRegExp(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is error instance
         *
         * For example:
         *
         *     xs.assert.error(new Error);
         *
         * @method error
         *
         * @param {Error} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.error = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not error object';
            }

            //assert
            if (!xs.isError(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is null
         *
         * For example:
         *
         *     xs.assert.null(null);
         *
         * @method null
         *
         * @param {*} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.null = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not null';
            }

            //assert
            if (!xs.isNull(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is iterable
         *
         * For example:
         *
         *     xs.assert.iterable({});
         *
         * @method iterable
         *
         * @param {*} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.iterable = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not iterable';
            }

            //assert
            if (!xs.isIterable(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is primitive
         *
         * For example:
         *
         *     xs.assert.primitive(1);
         *
         * @method primitive
         *
         * @param {*} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.primitive = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not primitive';
            }

            //assert
            if (!xs.isPrimitive(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is numeric
         *
         * For example:
         *
         *     xs.assert.object('1');
         *
         * @method numeric
         *
         * @param {*} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.numeric = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not numeric';
            }

            //assert
            if (!xs.isNumeric(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is defined
         *
         * For example:
         *
         *     xs.assert.defined({});
         *
         * @method defined
         *
         * @param {*} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.defined = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not defined';
            }

            //assert
            if (!xs.isDefined(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is empty
         *
         * For example:
         *
         *     xs.assert.empty([]);
         *
         * @method empty
         *
         * @param {*} value given value
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.empty = function (value, message, vars, Exception) {
            if (!xs.isString(message)) {
                message = '"' + value + '" is not empty';
            }

            //assert
            if (!xs.isEmpty(value)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given fn is Class
         *
         * For example:
         *
         *     xs.assert.Class(xs.Class(xs.emptyFn));
         *
         * @method Class
         *
         * @param {Function} fn given constructor
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        var _class = me.Class = function (fn, message, vars, Exception) {
            //assert, that fn is function
            _fn(fn);

            if (!xs.isString(message)) {
                message = '"' + fn + '" is not Class';
            }

            //assert
            if (fn.contractor !== xs.Class) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given fn is Interface
         *
         * For example:
         *
         *     xs.assert.Interface(xs.Interface(xs.emptyFn));
         *
         * @method Interface
         *
         * @param {Function} fn given constructor
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        var _interface = me.Interface = function (fn, message, vars, Exception) {
            //assert, that fn is function
            _fn(fn);

            if (!xs.isString(message)) {
                message = '"' + fn + '" is not Interface';
            }

            //assert
            if (fn.contractor !== xs.Interface) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given value is instance of given constructor
         *
         * For example:
         *
         *     xs.assert.instanceof(object, Class);
         *
         * @method instance
         *
         * @param {Object} object given instance
         * @param {Function} Class expected constructor
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.instance = function (object, Class, message, vars, Exception) {
            //assert that object is object
            _object(object);

            //assert, that Class is class
            _class(Class);

            //assert that object.self is class
            _class(object.self);

            if (!xs.isString(message)) {
                message = '"' + object + '" is not instance of "' + (Class.label ? Class.label : Class.name) + '"';
            }

            //assert
            if (!(object instanceof Class) && !(object.self.mixins(Class))) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Verifies, that given object is instance of Class, that implements given Interface
         *
         * For example:
         *
         *     xs.assert.implements(object, Interface);
         *
         * @method implements
         *
         * @param {Object} object verified object
         * @param {Function} Interface verified interface
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} [Exception] error class
         */
        me.implements = function (object, Interface, message, vars, Exception) {
            //assert that object is object
            _object(object);

            //assert that Interface is interface
            _interface(Interface);

            //assert that object.self is class
            _class(object.self);

            if (!xs.isString(message)) {
                message = 'Class "' + object.self.label + '" does not implement interface "' + Interface.label + '"';
            }

            //assert
            if (!object.self.implements(Interface)) {
                _raise(message, vars, Exception);
            }
        };

        /**
         * Raises error of given type with given
         *
         * @ignore
         *
         * @private
         *
         * @method raise
         *
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         * @param {Function} Exception error class
         *
         * @throws {Error}
         */
        var _raise = function (message, vars, Exception) {
            var error;

            //vars given
            if (xs.isObject(vars)) {

                //translate message
                message = xs.translate(message, vars);

                //if exception not given - default to error
                if (!xs.isFunction(Exception)) {
                    Exception = Error;
                }

                //Exception given instead of vars (vars are empty)
            } else if (xs.isFunction(vars)) {
                Exception = vars;
                vars = {};

                //only message given
            } else {
                Exception = Error;
                vars = {};
            }

            error = new Exception(message);
            error.vars = vars;

            throw error;
        };

        return me;
    })();

})(window, 'xs');