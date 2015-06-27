/**
 * Event class for events, being thrown when pointer tap ends
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.TapEnd
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.TapEnd', function (self) {

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

    //timeout after touchEnd/touchCancel, while pointerUp events will be ignored
    var pointerUpTimeout = 400;

    var captureAllEvents = function (target) {
        var capture = {
            target: target,
            //write last tapEnd time
            lastTime: 0
        };

        var el = target.private.el;

        //capture touch end
        capture.handleTouchEnd = xs.bind(handleTouchEnd, capture);
        el.addEventListener('touchend', capture.handleTouchEnd);
        el.addEventListener('touchcancel', capture.handleTouchEnd);

        //capture pointerUp
        capture.handleTouchPointerUp = xs.bind(handleTouchPointerUp, capture);
        el.addEventListener(self.pointerEvents.pointerUp, capture.handleTouchPointerUp);

        return capture;
    };

    var releaseAllEvents = function (target, capture) {
        target.private.el.removeEventListener('touchend', capture.handleTouchEnd);
        target.private.el.removeEventListener('touchcancel', capture.handleTouchEnd);
        target.private.el.removeEventListener(self.pointerEvents.pointerUp, capture.handleTouchPointerUp);
    };

    var capturePointerEvents = function (target) {
        var capture = {
            target: target
        };

        //capture pointer up event
        capture.handlePointerPointerUp = xs.bind(handlePointerPointerUp, capture);
        target.private.el.addEventListener(self.pointerEvents.pointerUp, capture.handlePointerPointerUp);

        return capture;
    };

    var releasePointerEvents = function (target, capture) {
        target.private.el.removeEventListener(self.pointerEvents.pointerUp, capture.handlePointerPointerUp);
    };

    //define handler for touchEnd event
    var handleTouchEnd = function (event) {
        var me = this;
        //console.log('touchEnd registered. Time:', Date(me.timeEnd));

        //write touchEnd time
        me.timeEnd = Date.now();

        //emit event
        return self.emitEvent(me.target, event);
    };

    //define handler for pointerUp event on touch device
    var handleTouchPointerUp = function (event) {
        var me = this;

        //console.log('touch pointerUp happened');
        //check timeout
        if (Date.now() - me.timeEnd < pointerUpTimeout) {
            //console.log('touch pointerUp is duplicate. Time diff:', Date.now() - me.timeEnd, '<', pointerUpTimeout);

            //cancel event
            return self.cancelEvent(event);
        }

        //emit event
        return self.emitEvent(me.target, event);
    };

    //define handler for pointerUp event on non-touch device
    var handlePointerPointerUp = function (event) {
        var me = this;
        //console.log('pointer click happened');

        //emit event
        return self.emitEvent(me.target, event);
    };

});