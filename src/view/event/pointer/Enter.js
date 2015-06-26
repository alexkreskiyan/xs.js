/**
 * Event class for events, being thrown when pointer enters element
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Enter
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.Enter', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.pointer.TargetChange';

    Class.static.method.capture = function (element) {
        var capture = {
            element: element
        };

        //capture pointerEnter event
        capture.handlePointerEnter = xs.bind(handlePointerEnter, capture);
        element.private.el.addEventListener(self.pointerEvents.pointerEnter, capture.handlePointerEnter);

        return capture;
    };

    Class.static.method.release = function (element, capture) {
        element.private.el.removeEventListener(self.pointerEvents.pointerEnter, capture.handlePointerEnter);
    };

    //define handle for `click` event
    var handlePointerEnter = function (event) {
        var me = this;
        //console.log('pointer enter happened');

        //emit event
        return self.emitEvent(me.element, event);
    };

});