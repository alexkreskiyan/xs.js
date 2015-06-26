/**
 * Event class for events, being thrown when pointer tap starts
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Move
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.Move', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.pointer.TouchChange';

    Class.static.method.capture = function (element) {
        if (xs.isTouch) {
            return captureAllEvents(element);
        } else {
            return capturePointerEvents(element);
        }
    };

    Class.static.method.release = function (element, capture) {
        if (xs.isTouch) {
            return releaseAllEvents(element, capture);
        } else {
            return releasePointerEvents(element, capture);
        }
    };

    var captureAllEvents = function (element) {
        var capture = {
            element: element,
            Event: self
        };

        var el = element.private.el;

        //capture touch move
        capture.handleTouchMove = xs.bind(handleTouchMove, capture);
        el.addEventListener('touchmove', capture.handleTouchMove);

        //capture mouseDown
        capture.handleTouchPointerMove = xs.bind(handleTouchPointerMove, capture);
        el.addEventListener(self.pointerEvents.pointerMove, capture.handleTouchPointerMove);

        return capture;
    };

    var releaseAllEvents = function (element, capture) {
        element.private.el.removeEventListener('touchmove', capture.handleTouchMove);
        element.private.el.removeEventListener(self.pointerEvents.pointerMove, capture.handleTouchPointerMove);
    };

    var capturePointerEvents = function (element) {
        var capture = {
            element: element,
            Event: self
        };

        //capture touch start
        capture.handlePointerPointerMove = xs.bind(handlePointerPointerMove, capture);
        element.private.el.addEventListener(self.pointerEvents.pointerMove, capture.handlePointerPointerMove);

        return capture;
    };

    var releasePointerEvents = function (element, capture) {
        element.private.el.removeEventListener(self.pointerEvents.pointerMove, capture.handlePointerPointerMove);
    };

    //define handler for touchMove event
    var handleTouchMove = function (event) {
        var me = this;
        //console.log('touchEnd registered. Time:', Date(me.timeEnd));

        //emit event
        return self.emitEvent(me.element, event);
    };

    //define handler for pointerMove event on touch device
    var handleTouchPointerMove = function (event) {
        var me = this;

        //console.log('touch pointerMove happened');

        //emit event
        return self.emitEvent(me.element, event);
    };

    //define handler for pointerMove event on non-touch device
    var handlePointerPointerMove = function (event) {
        var me = this;
        //console.log('pointer move happened');

        //emit event
        return self.emitEvent(me.element, event);
    };

});