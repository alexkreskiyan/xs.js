/**
 * Event class for events, being thrown when page context size changed
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.context.Resize
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.context.Resize', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.Event';

    Class.implements = [
        'ns.pointer.IEvent'
    ];

    Class.static.method.capture = function (target) {
        //call parent
        self.parent.capture(target);

        var capture = {
            target: target
        };

        //capture resize event
        capture.handleResize = xs.bind(handleResize, capture);
        window.addEventListener('resize', capture.handleResize);

        return capture;
    };

    Class.static.method.release = function (target, capture) {
        //call parent
        self.parent.release(target, capture);

        window.removeEventListener('resize', capture.handleResize);
    };

    //define handle for `click` event
    var handleResize = function (event) {
        var me = this;

        //emit event
        return self.emitEvent(me.target, event);
    };

});