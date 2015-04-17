'use strict';

/**
 * This preprocessor automatically creates and saves logger instance for this class as Class.log
 *
 * This is made to automatically create logger instances, that use Class.label as category.
 *
 * Later, logger can be accessed via self.log
 *
 * @member xs.class.preprocessors
 *
 * @private
 *
 * @abstract
 *
 * @property logger
 */
xs.class.preprocessors.add('logger', function () {

    return true;
}, function (Class) {

    //assign logger instance
    Class.log = new xs.log.Logger(Class.label ? Class.label : 'undefined');
});