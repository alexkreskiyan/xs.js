/**
 * Event class for events, being thrown when pointer moves out of element
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Out
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.Out', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.pointer.TargetChange';

    Class.static.method.capture = function (element) {
        var capture = {
            element: element,
            Event: self
        };

        //capture pointerOut event
        capture.handlePointerOut = xs.bind(handlePointerOut, capture);
        element.private.el.addEventListener(self.pointerEvents.pointerOut, capture.handlePointerOut);

        return capture;
    };

    Class.static.method.release = function (element, capture) {
        element.private.el.removeEventListener(self.pointerEvents.pointerOut, capture.handlePointerOut);
    };

    //define handle for `click` event
    var handlePointerOut = function (event) {
        var me = this;
        //console.log('pointer out happened');

        //emit event
        return self.emitEvent(me.element, event);
    };

});