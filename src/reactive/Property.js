'use strict';

var log = new xs.log.Logger('xs.core.Promise');

var assert = new xs.core.Asserter(log, StreamError);

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class StreamError
 */
function StreamError(message) {
    this.message = 'xs.reactive.Stream::' + message;
}

StreamError.prototype = new Error();