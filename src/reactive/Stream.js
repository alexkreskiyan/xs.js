'use strict';

var log = new xs.log.Logger('xs.core.Promise');

var assert = new xs.core.Asserter(log, StreamError);

//define xs.reactive
if (!xs.reactive) {
    xs.reactive = {};
}

/**
 * xs.reactive.Stream is core framework class, that is used for reactive representations
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @private
 *
 * @class xs.reactive.Stream
 */

/**
 * xs.reactive.Stream constructor
 *
 * @constructor
 */
var Stream = xs.reactive.Stream = function (emitter) {
    var me = this;

    //assert, that emitter is a function
    assert.fn(emitter, 'constructor - given emitter `$emitter` is not a function', {
        $emitter: emitter
    });

    //run emitter with 2 arguments - send, end
    var handleEnd = emitter(function (data) {
        //send data in stream
        me.send(data);
    }, function () {

        //handle end (free resources)
        handleEnd();

        //internal end handler
        me.end();
    });

    //assert, that handleEnd is a function
    assert.fn(handleEnd, 'constructor - given stream end handler `$handler` is not a function', {
        $handler: handleEnd
    });
};

Stream.prototype.send = function (data) {
    console.log('send', data);
};

Stream.prototype.end = function () {
    console.log('end');
};

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