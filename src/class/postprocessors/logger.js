'use strict';

var log = new xs.log.Logger('xs.class.postprocessors.logger');

/**
 * This postprocessor automatically creates and saves logger instance for this class as Class.log
 *
 * This is made to automatically create logger instances, that use Class.label as category.
 *
 * Later, logger can be accessed via self.label
 *
 * @member xs.class.postprocessors
 *
 * @private
 *
 * @abstract
 *
 * @property logger
 */
xs.class.postprocessors.add('logger', function () {

    return true;
}, function (Class) {
    log.trace(Class.label ? Class.label : 'undefined');

    //assign logger instance
    Class.log = new xs.log.Logger(Class.label ? Class.label : 'undefined');
});