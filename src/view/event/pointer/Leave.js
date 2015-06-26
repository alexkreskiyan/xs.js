/**
 * Event class for events, being thrown when pointer leaves element
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Leave
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.Leave', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.pointer.TargetChange';

    Class.static.method.capture = function (element) {
        var capture = {
            element: element
        };

        //capture pointerLeave event
        capture.handlePointerLeave = xs.bind(handlePointerLeave, capture);
        element.private.el.addEventListener(self.pointerEvents.pointerLeave, capture.handlePointerLeave);

        return capture;
    };

    Class.static.method.release = function (element, capture) {
        element.private.el.removeEventListener(self.pointerEvents.pointerLeave, capture.handlePointerLeave);
    };

    //define handle for `click` event
    var handlePointerLeave = function (event) {
        var me = this;
        //console.log('pointer leave happened');

        //emit event
        return self.emitEvent(me.element, event);
    };

});