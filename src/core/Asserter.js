'use strict';

//define xs.core
xs.getNamespace(xs, 'core');

//create assert mock
var assert = {
    ok: function () {

    },
    fn: function () {

    }
};

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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
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

    raise.call(me, message, vars);
};

/**
 * Short name testing regular expression
 *
 * @ignore
 *
 * @type {RegExp}
 */
var shortNameRe = /^[A-Za-z][A-Za-z0-9]*$/;

/**
 * Verifies, that given string is a valid shortName
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.shortName('name');
 *
 * @method shortName
 *
 * @param {String} name given name
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.shortName = function (name, message, vars) {
    var me = this;

    //assert that name is a string
    me.string(name, 'shortName - given name `$name` is not a string', {
        $name: name
    });

    //assert
    if (shortNameRe.test(name)) {

        return;
    }

    raise.call(me, message, vars);
};

/**
 * Full name testing regular expression
 *
 * @ignore
 *
 * @type {RegExp}
 */
var fullNameRe = /^[A-Za-z][A-Za-z0-9]*(?:\.[A-Za-z][A-Za-z0-9]*)*$/;

/**
 * Verifies, that given string is a valid shortName
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.fullName('name.sub');
 *
 * @method fullName
 *
 * @param {String} name given name
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.fullName = function (name, message, vars) {
    var me = this;

    //assert that name is a string
    me.string(name, 'fullName - given name `$name` is not a string', {
        $name: name
    });

    //assert
    if (fullNameRe.test(name)) {

        return;
    }

    raise.call(me, message, vars);
};

/**
 * Verifies, that given candidate is a contract
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.contract(xs.Class(xs.noop));
 *
 * @method contract
 *
 * @param {Function} contract given contract candidate
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.contract = function (contract, message, vars) {
    var me = this;

    //assert
    if (xs.isContract(contract)) {

        return;
    }

    raise.call(me, message, vars);
};

/**
 * Verifies, that given contract is processed
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     xs.Class(xs.noop,function(Class){
 *         asserter.processed(Class);
 *     });
 *
 * @method processed
 *
 * @param {Function} contract given contract candidate
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.processed = function (contract, message, vars) {
    var me = this;

    //assert, that contract is a contract
    me.contract(contract, 'Contract `$contract` is not a contract', {
        $contract: contract
    });

    //assert
    if (!contract.hasOwnProperty('isProcessing')) {

        return;
    }

    raise.call(me, message, vars);
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
 *     asserter.class(xs.Class(xs.noop));
 *
 * @method class
 *
 * @param {Function} Class given constructor
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.class = function (Class, message, vars) {
    var me = this;

    //assert, that Class is function
    me.fn(Class, 'Class `$Class` is not a function', {
        $Class: Class
    });

    //assert
    if (xs.isClass(Class)) {

        return;
    }

    raise.call(me, message, vars);
};

/**
 * Verifies, that given fn is interface
 *
 * For example:
 *
 *     //create asserter instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //create asserter instance
 *     var asserter = new xs.core.Asserter(logger, Error);
 *
 *     asserter.interface(xs.Interface(xs.noop));
 *
 * @method interface
 *
 * @param {Function} Interface given constructor
 * @param {String} message error message
 * @param {Object} [vars] error optional vars
 */
Asserter.prototype.interface = function (Interface, message, vars) {
    var me = this;

    //assert, that fn is function
    me.fn(Interface, 'Interface `$Interface` is not a function', {
        $Interface: Interface
    });

    //assert
    if (xs.isInterface(Interface)) {

        return;
    }

    raise.call(me, message, vars);
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
    me.class(Class, 'Class `$Class` is not a class', {
        $Class: Class
    });

    //assert that object.self is class
    me.class(instance.self, 'Instance.self `$Class` is not a class', {
        $Class: instance.self
    });

    //assert a mixin
    if (instance.self.mixins(Class)) {

        return;
    }

    raise.call(me, message, vars);
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
    me.interface(Interface, 'Interface `$Interface` is not an interface', {
        $Interface: Interface
    });

    //assert that instance.self is class
    me.class(instance.self, 'Instance.self `$Class` is not a class', {
        $Class: instance.self
    });

    //assert
    if (instance.self.implements(Interface)) {
        return;
    }

    raise.call(me, message, vars);
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
Asserter.prototype.raise = raise;

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsCoreAsserterError
 */
function XsCoreAsserterError(message) {
    this.message = 'xs.core.Asserter::' + message;
}

XsCoreAsserterError.prototype = new Error();

//create assert. here fake assert is needed for first call
assert = new xs.core.Asserter(new xs.log.Logger('xs'), XsCoreAsserterError);

//call hooks
xs.log.Logger.hookReady();