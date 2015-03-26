'use strict';

var log = new xs.log.Logger('xs.reactive.Reactive');

var assert = new xs.core.Asserter(log, XsReactiveReactiveError);

//save reference to module
module.send = function send(handlers, event) {

    //assert, that event inherits module.Event
    assert.ok(event instanceof module.Event, 'send - given event `$event` is not an instance of xs.reactive.event.Event', {
        $event: event
    });

    //return whether handlers processing was cancelled
    return !handlers.find(function (item) {

        //ignore, if item is suspended or has another target
        if (item.suspended || item.target.indexOf(event.constructor) < 0) {

            return;
        }

        //if handler returns false - it cancels processing
        return item.handler.call(item.scope, event) === false;
    });
};

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsReactiveReactiveError
 */
function XsReactiveReactiveError(message) {
    this.message = 'xs.reactive.Reactive::' + message;
}

XsReactiveReactiveError.prototype = new Error();