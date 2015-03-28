'use strict';

//define xs.log
if (!xs.log) {
    xs.log = {};
}

/**
 * Store of all registered profiling records
 *
 * @ignore
 *
 * @static
 *
 * @private
 *
 * @property profiles
 *
 * @type {Array}
 */
var profiles = {};

//create assert mock
var assert = {
    ok: function () {
    },
    string: function () {
    }
};

//create reference to a function, that will be called each time, when new log entry appears
var processEntry = function () {
    console.log.apply(console, arguments);
};

/**
 * xs.log.Logger is key system element, that performs logging operations.
 *
 * For example:
 *
 *     //create logger instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //log message to `xs` category
 *     logger.log('some message');
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.log.Logger
 *
 *
 *
 * @constructor
 *
 * Logger constructor. Logger category is given as single argument
 *
 * For example:
 *
 *     //create logger instance
 *     var logger = new xs.log.Logger('xs');
 *
 * @param {String} category logger messages' category
 */
var Logger = xs.log.Logger = function (category) {
    var me = this;

    //assert, that category is valid (via xs.log.Router.isCategory)
    assert.ok(isCategory(category), 'Given category `$category` is not a valid category', {
        $category: category
    });

    //save category
    me.category = category;

    //create profiling access object
    me.profile = {
        category: category,
        start: profileStart,
        end: profileEnd
    };
};

/**
 * Adds error log entry via this logger
 *
 * For example:
 *
 *     //create logger instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //add log entry
 *     logger.error('error happened');
 *
 * @method error
 *
 * @param {String} message log message
 * @param {Object} [data] message data
 */
Logger.prototype.error = function (message, data) {
    var me = this;

    //assert, that message is string
    assert.string(message, 'error - given message `$message` is not a string', {
        $message: message
    });

    //assert, that data is either not given or is an object
    assert.ok(arguments.length === 1 || xs.isObject(data), 'error - given data `$data` is not an object', {
        $data: data
    });

    if (data) {
        processEntry(me.category, xs.log.Error, message, data);
    } else {
        processEntry(me.category, xs.log.Error, message);
    }
};

/**
 * Adds warning log entry via this logger
 *
 * For example:
 *
 *     //create logger instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //add log entry
 *     logger.warning('waning');
 *
 * @method warn
 *
 * @param {String} message log message
 * @param {Object} [data] message data
 */
Logger.prototype.warn = function (message, data) {
    var me = this;

    //assert, that message is string
    assert.string(message, 'warn - given message `$message` is not a string', {
        $message: message
    });

    //assert, that data is either not given or is an object
    assert.ok(arguments.length === 1 || xs.isObject(data), 'warn - given data `$data` is not an object', {
        $data: data
    });

    if (data) {
        processEntry(me.category, xs.log.Warning, message, data);
    } else {
        processEntry(me.category, xs.log.Warning, message);
    }
};

/**
 * Adds info log entry via this logger
 *
 * For example:
 *
 *     //create logger instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //add log entry
 *     logger.info('start');
 *
 * @method info
 *
 * @param {String} message log message
 * @param {Object} [data] message data
 */
Logger.prototype.info = function (message, data) {
    var me = this;

    //assert, that message is string
    assert.string(message, 'info - given message `$message` is not a string', {
        $message: message
    });

    //assert, that data is either not given or is an object
    assert.ok(arguments.length === 1 || xs.isObject(data), 'info - given data `$data` is not an object', {
        $data: data
    });

    if (data) {
        processEntry(me.category, xs.log.Info, message, data);
    } else {
        processEntry(me.category, xs.log.Info, message);
    }
};

/**
 * Adds log entry with specific {@link xs.log#Trace} log level via this logger.
 * That level is used in development stage instead of info and this calls should be removed in production mode
 *
 * For example:
 *
 *     //create logger instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //add log entry
 *     logger.log('start');
 *
 * @method log
 *
 * @param {String} message log message
 * @param {Object} [data] message data
 */
Logger.prototype.trace = function (message, data) {
    var me = this;

    //assert, that message is string
    assert.string(message, 'info - given message `$message` is not a string', {
        $message: message
    });

    //assert, that data is either not given or is an object
    assert.ok(arguments.length === 1 || xs.isObject(data), 'info - given data `$data` is not an object', {
        $data: data
    });

    if (data) {
        processEntry(me.category, xs.log.Trace, message, data);
    } else {
        processEntry(me.category, xs.log.Trace, message);
    }
};

/**
 * Category name testing regular expression
 *
 * @ignore
 *
 * @type {RegExp}
 */
var categoryRe = /^[A-Za-z]{1}[A-Za-z0-9]*(?:\.{1}[A-Za-z]{1}[A-Za-z0-9]*)*$/;

/**
 * Returns whether given string is correct router category name
 *
 * For example:
 *
 *     xs.log.router.isCategory('xs.module.my.Class'); //true
 *
 * @private
 *
 * @method isCategory
 *
 * @param {String} category verified category name
 *
 * @return {String} whether category name is correct
 */
function isCategory(category) {

    //assert that category is a string
    assert.string(category, 'isCategory - given category `$category` is not a string', {
        $category: category
    });

    return categoryRe.test(category);
}

/**
 * Begins profiling with given mark.
 *
 * For example:
 *
 *     //create logger instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //start profiling
 *     logger.profile.start('test');
 *
 * @method start
 *
 * @param {String} mark profiling mark
 */
function profileStart(mark) {
    var me = this;

    //assert, that mark is string
    assert.string(mark, 'profile.start - given mark `$mark` is not a string', {
        $mark: mark
    });

    //get profile mark full name
    var name = me.category + '.' + mark;

    //assert, that profile is not redefining currently existing one
    assert.not(profiles.hasOwnProperty(name), 'profile.start - given mark `$mark` is already used', {
        $mark: mark
    });

    //set profile record
    profiles[ name ] = {
        time: (new Date()).valueOf()
    };
}

/**
 * Ends profiling for given mark.
 *
 * For example:
 *
 *     //create logger instance
 *     var logger = new xs.log.Logger('xs');
 *
 *     //start profiling
 *     logger.profile.start('test');
 *
 *     //end profiling
 *     logger.profile.end('test');
 *
 * @method end
 *
 * @param {String} mark profiling mark
 */
function profileEnd(mark) {
    var me = this;

    //assert, that mark is string
    assert.string(mark, 'profile.end - given mark `$mark` is not a string', {
        $mark: mark
    });

    //get profile mark full name
    var name = me.category + '.' + mark;

    //assert, that profile record is defined
    assert.ok(profiles.hasOwnProperty(name), 'profile.end - given mark `$mark` has not defined a profile', {
        $mark: mark
    });

    //get profile record
    var profile = profiles[ name ];

    //evaluate execution time
    profile.time = (new Date()).valueOf() - profile.time;

    //remove profile from storage
    delete profiles[ name ];

    //process profiling message (mark) with profile as data
    processEntry(me.category, xs.log.Profile, mark, profile);
}

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsLogLoggerError
 */
function XsLogLoggerError(message) {
    this.message = 'xs.log.Logger::' + message;
}

XsLogLoggerError.prototype = new Error();

//hook method to create asserter. here fake assert is needed for first call
Logger.hookReady = function () {
    assert = new xs.core.Asserter(new xs.log.Logger('xs.log.Logger'), XsLogLoggerError);
    delete Logger.hookReady;
};