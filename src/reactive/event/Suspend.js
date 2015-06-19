'use strict';

var log = new xs.log.Logger('xs.reactive.event.Suspend');

var assert = new xs.core.Asserter(log, XsReactiveEventSuspendError);

var Suspend = xs.reactive.event.Suspend = function (event) {
    var me = this;

    me.private = {};

    assert.ok(module.isEvent(event), 'constructor - given event `$event` is not a valid event. Check xs.reactive.Reactive.isEvent for details', {
        $event: event
    });

    me.private.event = event;
};

//extend Suspend from module.Event
xs.extend(Suspend, module.event.Event);

Object.defineProperty(Suspend.prototype, 'event', {
    get: function () {
        return this.private.event;
    },
    set: xs.noop,
    configurable: false,
    enumerable: true
});

/**
 * Internal error class
 *
 * @ignore
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class XsReactiveEventSuspendError
 */
function XsReactiveEventSuspendError(message) {
    this.message = 'xs.reactive.event.Suspend::' + message;
}

XsReactiveEventSuspendError.prototype = new Error();