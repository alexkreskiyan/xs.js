'use strict';

var log = new xs.log.Logger('xs.reactive.event.Resume');

var assert = new xs.core.Asserter(log, XsReactiveEventResumeError);

var Resume = xs.reactive.event.Resume = function (event) {
    var me = this;

    me.private = {};

    assert.ok(module.isEvent(event), 'constructor - given event `$event` is not a valid event. Check xs.reactive.Reactive.isEvent for details', {
        $event: event
    });

    me.private.event = event;
};

//extend Resume from module.Event
xs.extend(Resume, module.event.Event);

Object.defineProperty(Resume.prototype, 'event', {
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
 * @class XsReactiveEventResumeError
 */
function XsReactiveEventResumeError(message) {
    this.message = 'xs.reactive.event.Resume::' + message;
}

XsReactiveEventResumeError.prototype = new Error();