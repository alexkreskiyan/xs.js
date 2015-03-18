'use strict';

//define xs.core
if (!xs.core) {
    xs.core = {};
}

//create assert mock
var assert = {
    ok: function () {

    },
    fn: function () {

    }
};

var slice = Function.prototype.call.bind(Array.prototype.slice);

/**
 * xs.core.Asserter is key system element, that performs asserting operations within classes and other logged instances
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     //assert equality (note about logs)
 *     asserter.ok(1 === 2, 'Values x($x) and y($y) are not equal', {
 *         $x: 1,
 *         $y: 2
 *     });
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.core.Asserter
 *
 *
 *
 * @constructor
 *
 * Asserter constructor. Logger category is given as single argument
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 * @param {xs.log.Logger} logger instance of xs.log.Logger, asserter reports it's exceptions to
 * @param {Function} Exception Exception class, used by asserter to generate exceptions
 */
var Asserter = xs.core.Asserter = function (logger, Exception) {
    var me = this;

    //assert, that logger is an instance of xs.log.Logger
    assert.ok(logger instanceof xs.log.Logger, 'constructor - given logger `$logger` is not an instance of xs.log.Logger', {
        $logger: logger
    });

    //assert, that  Exception is function
    assert.fn(Exception, 'constructor - given Exception class `$Exception` is not a function', {
        $Exception: Exception
    });

    //save logger
    me.logger = logger;

    //save Exception
    me.Exception = Exception;
};

/**
 * Verifies, that two values are equal (===)
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.equal(1, '1');
 *
 * @method equal
 *
 * @param {*} given given value
 * @param {*} expected given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.equal = function (given, expected, message, vars) {
    var me = this;

    //assert
    if (given === expected) {

        return;
    }

    raise.apply(me, slice(arguments, 2));
};

/**
 * Verifies, that given expression if true-like
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.ok(1 == 1);
 *
 * @method ok
 *
 * @param {Boolean} expression evaluated expression value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.ok = function (expression, message, vars) {
    var me = this;

    //assert
    if (expression) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given expression if false-like
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.not( 1 === 2);
 *
 * @method not
 *
 * @param {Boolean} expression evaluated expression value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.not = function (expression, message, vars) {
    var me = this;

    //assert
    if (!expression) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is object
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.object({});
 *
 * @method object
 *
 * @param {Object} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.object = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isObject(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is array
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.array([]);
 *
 * @method array
 *
 * @param {Array} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.array = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isArray(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is function
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.fn(xs.noop);
 *
 * @method fn
 *
 * @param {Function} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.fn = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isFunction(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is string
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.string('');
 *
 * @method string
 *
 * @param {String} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.string = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isString(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is number
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.number(1);
 *
 * @method number
 *
 * @param {Number} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.number = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isNumber(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is boolean
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.boolean(true);
 *
 * @method boolean
 *
 * @param {Boolean} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.boolean = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isBoolean(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is regular expression
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.regExp(/a/);
 *
 * @method regExp
 *
 * @param {RegExp} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.regExp = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isRegExp(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is error instance
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.error(new Error);
 *
 * @method error
 *
 * @param {Error} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.error = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isError(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is null
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.null(null);
 *
 * @method null
 *
 * @param {*} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.null = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isNull(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is iterable
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.iterable({});
 *
 * @method iterable
 *
 * @param {*} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.iterable = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isIterable(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is primitive
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.primitive(1);
 *
 * @method primitive
 *
 * @param {*} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.primitive = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isPrimitive(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is numeric
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.numeric('1');
 *
 * @method numeric
 *
 * @param {*} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.numeric = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isNumeric(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is defined
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.defined({});
 *
 * @method defined
 *
 * @param {*} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.defined = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isDefined(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is empty
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.empty([]);
 *
 * @method empty
 *
 * @param {*} value given value
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.empty = function (value, message, vars) {
    var me = this;

    //assert
    if (xs.isEmpty(value)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given fn is Class
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.Class(xs.Class(xs.noop));
 *
 * @method Class
 *
 * @param {Function} Class given constructor
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.Class = function (Class, message, vars) {
    var me = this;

    //assert, that Class is function
    me.fn(Class, 'Class `$Class` is not a function', {
        $Class: Class
    });

    //assert
    if (xs.isClass(Class)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given fn is Interface
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.Interface(xs.Interface(xs.noop));
 *
 * @method Interface
 *
 * @param {Function} Interface given constructor
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.Interface = function (Interface, message, vars) {
    var me = this;

    //assert, that fn is function
    me.fn(Interface, 'Interface `$Interface` is not a function', {
        $Interface: Interface
    });

    //assert
    if (xs.isInterface(Interface)) {

        return;
    }

    raise.apply(me, slice(arguments, 1));
};

/**
 * Verifies, that given value is instance of given constructor
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.instance(object, Class);
 *
 * @method instance
 *
 * @param {Object} instance given instance
 * @param {Function} Class expected constructor
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.instance = function (instance, Class, message, vars) {
    var me = this;

    //assert, that Class is a function
    me.fn(Class, 'Class `$Class` is not a function', {
        $Class: Class
    });

    //if instanceof runs ok - return
    if (instance instanceof Class) {

        return;
    }

    //assert that instance is object
    me.object(instance, 'Instance `$instance` is not an object', {
        $instance: instance
    });

    //assert, that Class is class
    me.Class(Class, 'Class `$Class` is not a class', {
        $Class: Class
    });

    //assert that object.self is class
    me.Class(instance.self, 'Instance.self `$Class` is not a class', {
        $Class: instance.self
    });

    //assert a mixin
    if (instance.self.mixins(Class)) {

        return;
    }

    raise.apply(me, slice(arguments, 2));
};

/**
 * Verifies, that given object is instance of Class, that implements given Interface
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.implements(object, Interface);
 *
 * @method implements
 *
 * @param {Object} instance verified object
 * @param {Function} Interface verified interface
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.implements = function (instance, Interface, message, vars) {
    var me = this;

    //assert that instance is object
    me.object(instance, 'Instance `$instance` is not an object', {
        $instance: instance
    });

    //assert, that Interface is interface
    me.Interface(Interface, 'Interface `$Interface` is not an interface', {
        $Interface: Interface
    });

    //assert that instance.self is class
    me.Class(instance.self, 'Instance.self `$Class` is not a class', {
        $Class: instance.self
    });

    //assert
    if (instance.self.implements(Interface)) {
        return;
    }

    raise.apply(me, slice(arguments, 2));
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
 *
 * @throws {Error}
 */
function raise(message, vars) {
    var me = this;

    var error;

    //if message is not a string - throw SyntaxError
    if (!xs.isString(message)) {
        //default message
        message = 'xs.core.Asserter achieved no error message';

        //create syntax error
        error = new SyntaxError(message);

        //process it with logger
        me.logger.error(message);

        //throw asserter syntax error
        throw error;
    }

    //vars given
    if (xs.isObject(vars)) {

        //translate message
        message = xs.translate(message, vars);

        //only message given
    } else {
        vars = {};
    }

    //create new me.Exception
    error = new me.Exception(message);
    error.vars = vars;

    //process it with logger
    me.logger.error(message, vars);

    throw error;
}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class AsserterError
 */
function AsserterError(message) {
    this.message = 'xs.core.Asserter::' + message;
}

AsserterError.prototype = new Error();

//create assert. here fake assert is needed for first call
assert = new xs.core.Asserter(new xs.log.Logger('xs'), AsserterError);

//call hooks
xs.log.Router.hookReady();
xs.log.Logger.hookReady();
xs.core.Collection.hookReady();