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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.equal = function (given, expected, Exception, message, vars) {
            message || (message = 'Given "' + given + '" is not same to expected "' + expected + '"');

            //assert
            given === expected || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.ok = function (expression, Exception, message, vars) {
            message || (message = 'Expression "' + expression + '" failed');

            //assert
            expression || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.not = function (expression, Exception, message, vars) {
            message || (message = 'Expression "' + expression + '" succeed');

            //assert
            expression && _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.object = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not object');

            //assert
            xs.isObject(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.array = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not array');

            //assert
            xs.isArray(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        var _fn = me.fn = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not function');

            //assert
            xs.isFunction(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.string = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not string');

            //assert
            xs.isString(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.number = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not number');

            //assert
            xs.isNumber(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.boolean = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not boolean');

            //assert
            xs.isBoolean(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.regExp = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not regular expression');

            //assert
            xs.isRegExp(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.error = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not error object');

            //assert
            xs.isError(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.null = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not null');

            //assert
            xs.isNull(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.iterable = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not iterable');

            //assert
            xs.isIterable(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.primitive = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not primitive');

            //assert
            xs.isPrimitive(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.numeric = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not numeric');

            //assert
            xs.isNumeric(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.defined = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not defined');

            //assert
            xs.isDefined(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.empty = function (value, Exception, message, vars) {
            message || (message = '"' + value + '" is not empty');

            //assert
            xs.isEmpty(value) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        var _class = me.Class = function (fn, Exception, message, vars) {
            //assert, that fn is function
            _fn(fn);

            message || (message = '"' + fn + '" is not Class');

            //assert
            (fn.contractor == xs.Class) || _raise(Exception, message, vars);
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
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        var _interface = me.Interface = function (fn, Exception, message, vars) {
            //assert, that fn is function
            _fn(fn);

            message || (message = '"' + fn + '" is not Interface');

            //assert
            (fn.contractor == xs.Interface) || _raise(Exception, message, vars);
        };

        /**
         * Verifies, that given value is instance of given constructor
         *
         * For example:
         *
         *     xs.assert.instanceof({}, Object);
         *
         * @method instance
         *
         * @param {*} value given value
         * @param {Function} Class expected constructor
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.instance = function (value, Class, Exception, message, vars) {
            //assert, that Class is function
            _fn(Class);

            message || (message = '"' + value + '" is not instance of "' + (Class.label ? Class.label : Class.name) + '"');

            //assert
            (value instanceof Class) || _raise(Exception, message, vars);
        };

        /**
         * Verifies, that given Child class inherits from given Parent class
         *
         * For example:
         *
         *     xs.assert.inherits(Child, Parent);
         *
         * @method inherits
         *
         * @param {Function} Child expected Child class
         * @param {Function} Parent expected Parent class
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.inherits = function (Child, Parent, Exception, message, vars) {
            //assert that Child is class
            _class(Child);

            //assert that Parent is class
            _class(Parent);

            message || (message = '"' + Child.label + '" does not inherit from "' + Parent.label + '"');

            //assert
            Child.inherits(Parent) || _raise(Exception, message, vars);
        };

        /**
         * Verifies, that given Class implements given Interface
         *
         * For example:
         *
         *     xs.assert.implements(Class, Inteface);
         *
         * @method implements
         *
         * @param {Function} Class verified class
         * @param {Function} Interface verified interface
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.implements = function (Class, Interface, Exception, message, vars) {
            //assert that Class is class
            _class(Class);

            //assert that Interface is interface
            _interface(Interface);

            message || (message = 'Class "' + Class.label + '" does not implement interface "' + Interface.label + '"');

            //assert
            Class.implements(Interface) || _raise(Exception, message, vars);
        };

        /**
         * Verifies, that given Class is mixed with given Mixin
         *
         * For example:
         *
         *     xs.assert.mixins(Base, Mix);
         *
         * @method mixins
         *
         * @param {Function} Class verified
         * @param {Function} Mixin expected mixin class
         * @param {Function} Exception error class
         * @param {String} message error message
         * @param {Object} [vars] error optional vars
         */
        me.mixins = function (Class, Mixin, Exception, message, vars) {
            //assert that Child is class
            _class(Class);

            //assert that Mixin is class
            _class(Mixin);

            message || (message = 'Class "' + Class.label + '" is not mixed with class "' + Mixin.label + '"');

            //assert
            Class.mixins(Mixin) || _raise(Exception, message, vars);
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
    });

})(window, 'xs');