'use strict';

//define xs.log
if (!xs.log) {

    xs.log = {};
}

/**
 * Log levels enum
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.log
 *
 * @singleton
 */

/**
 * Error level. Is used to log application errors
 *
 * @readonly
 *
 * @property Error
 *
 * @type {Number}
 */
xs.log.Error = 0x1;

/**
 * Warning level. Is used to log application warnings
 *
 * @readonly
 *
 * @property Warning
 *
 * @type {Number}
 */
xs.log.Warning = 0x2;

/**
 * Info level. Is used for application status logging
 *
 * @readonly
 *
 * @property Info
 *
 * @type {Number}
 */
xs.log.Info = 0x4;

/**
 * Trace level. Is used for development stage logging
 *
 * @readonly
 *
 * @property Trace
 *
 * @type {Number}
 */
xs.log.Trace = 0x8;

/**
 * Profile level. Is used for application profiling messages
 *
 * @readonly
 *
 * @property Profile
 *
 * @type {Number}
 */
xs.log.Profile = 0x10;

/**
 * xs.log.Router is key system element, that performs logging operations
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.log.Router
 *
 * @singleton
 */
xs.log.Router = new xs.reactive.Stream(function (stream) {
    xs.log.Logger.hookProcess(stream.send);
});