/**
 * Event class for events, being thrown when page context's visibility is being changed
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.context.VisibilityChange
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.context.VisibilityChange', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.Event';

    Class.implements = [
        'ns.pointer.IEvent'
    ];

    Class.static.method.capture = function (target) {
        var capture = {
            target: target
        };

        //capture visibilityChange event
        capture.handleVisibilityChange = xs.bind(handleVisibilityChange, capture);
        document.addEventListener('visibilitychange', capture.handleVisibilityChange);

        return capture;
    };

    Class.static.method.release = function (target, capture) {
        self.assert.object(capture, 'release - given `$capture` is not an object', {
            $capture: capture
        });

        document.removeEventListener('visibilitychange', capture.handleVisibilityChange);
    };

    //define handle for `click` event
    var handleVisibilityChange = function (event) {
        var me = this;

        //emit event
        return self.emitEvent(me.target, event);
    };

});