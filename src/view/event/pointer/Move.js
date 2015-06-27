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

    Class.static.method.capture = function (target) {
        //call parent
        self.parent.capture(target);

        if (xs.isTouch) {
            return captureAllEvents(target);
        } else {
            return capturePointerEvents(target);
        }
    };

    Class.static.method.release = function (target, capture) {
        //call parent
        self.parent.release(target, capture);

        if (xs.isTouch) {
            return releaseAllEvents(target, capture);
        } else {
            return releasePointerEvents(target, capture);
        }
    };

    //interval to throttle move events
    var throttleInterval = 50;

    var captureAllEvents = function (target) {
        var capture = {
            target: target
        };

        var el = target.private.el;

        //capture touch move
        capture.handleTouchMove = xs.Function.throttle(handleTouchMove, throttleInterval, capture);
        el.addEventListener('touchmove', capture.handleTouchMove);

        //capture mouseDown
        capture.handleTouchPointerMove = xs.Function.throttle(handleTouchPointerMove, throttleInterval, capture);
        el.addEventListener(self.pointerEvents.pointerMove, capture.handleTouchPointerMove);

        return capture;
    };

    var releaseAllEvents = function (target, capture) {
        target.private.el.removeEventListener('touchmove', capture.handleTouchMove);
        target.private.el.removeEventListener(self.pointerEvents.pointerMove, capture.handleTouchPointerMove);
    };

    var capturePointerEvents = function (target) {
        var capture = {
            target: target
        };

        //capture touch start
        capture.handlePointerPointerMove = xs.Function.throttle(handlePointerPointerMove, throttleInterval, capture);
        target.private.el.addEventListener(self.pointerEvents.pointerMove, capture.handlePointerPointerMove);

        return capture;
    };

    var releasePointerEvents = function (target, capture) {
        target.private.el.removeEventListener(self.pointerEvents.pointerMove, capture.handlePointerPointerMove);
    };

    //define handler for touchMove event
    var handleTouchMove = function (event) {
        var me = this;
        //console.log('touchEnd registered. Time:', Date(me.timeEnd));

        //emit event
        return self.emitEvent(me.target, event);
    };

    //define handler for pointerMove event on touch device
    var handleTouchPointerMove = function (event) {
        var me = this;

        //console.log('touch pointerMove happened');

        //emit event
        return self.emitEvent(me.target, event);
    };

    //define handler for pointerMove event on non-touch device
    var handlePointerPointerMove = function (event) {
        var me = this;
        //console.log('pointer move happened');

        //emit event
        return self.emitEvent(me.target, event);
    };

});