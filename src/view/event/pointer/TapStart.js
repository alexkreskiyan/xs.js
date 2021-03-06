/**
 * Event class for events, being thrown when pointer tap starts
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.TapStart
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.TapStart', function (self) {

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

    //timeout after touch start, while pointerDown events will be ignored
    var pointerDownTimeout = 400;

    var captureAllEvents = function (target) {
        var capture = {
            target: target,
            //write last tapStart time
            lastTime: 0
        };

        var el = target.private.el;

        //capture touch start
        capture.handleTouchStart = xs.bind(handleTouchStart, capture);
        el.addEventListener('touchstart', capture.handleTouchStart);

        //capture touch end
        capture.handleTouchEnd = xs.bind(handleTouchEnd, capture);
        el.addEventListener('touchend', capture.handleTouchEnd);
        el.addEventListener('touchcancel', capture.handleTouchEnd);

        //capture pointerDown
        capture.handleTouchPointerDown = xs.bind(handleTouchPointerDown, capture);
        el.addEventListener(self.pointerEvents.pointerDown, capture.handleTouchPointerDown);

        return capture;
    };

    var releaseAllEvents = function (target, capture) {
        target.private.el.removeEventListener('touchstart', capture.handleTouchStart);
        target.private.el.removeEventListener('touchend', capture.handleTouchEnd);
        target.private.el.removeEventListener('touchcancel', capture.handleTouchEnd);
        target.private.el.removeEventListener(self.pointerEvents.pointerDown, capture.handleTouchPointerDown);
    };

    var capturePointerEvents = function (target) {
        var capture = {
            target: target
        };

        //capture touch start
        capture.handlePointerPointerDown = xs.bind(handlePointerPointerDown, capture);
        target.private.el.addEventListener(self.pointerEvents.pointerDown, capture.handlePointerPointerDown);

        return capture;
    };

    var releasePointerEvents = function (target, capture) {
        target.private.el.removeEventListener(self.pointerEvents.pointerDown, capture.handlePointerPointerDown);
    };

    //define handler for touchStart event
    var handleTouchStart = function (event) {
        var me = this;
        //console.log('touchStart registered. Time:', Date(Date.now()));

        //write touchStart time
        me.timeStart = Date.now();

        //emit event
        return self.emitEvent(me.target, event);
    };

    //define handler for touchEnd event
    var handleTouchEnd = function () {
        var me = this;

        //write end timestamp
        me.timeEnd = Date.now();

        //console.log('touchEnd registered. Time:', Date(me.timeEnd));
    };

    //define handler for pointerDown event on touch device
    var handleTouchPointerDown = function (event) {
        var me = this;

        //console.log('touch pointerDown happened');
        //check timeout and if touch not ended
        if (me.timeStart > me.timeEnd || Date.now() - me.timeEnd < pointerDownTimeout) {
            //if (me.timeStart > me.timeEnd) {
            //console.log('touch pointerDown happened before touch was released');
            //} else {
            //console.log('touch pointerDown is duplicate. Time diff:', Date.now() - me.timeEnd, '<', pointerDownTimeout);
            //}

            //cancel event
            return self.cancelEvent(event);
        }

        //emit event
        return self.emitEvent(me.target, event);
    };

    //define handler for pointerDown event on non-touch device
    var handlePointerPointerDown = function (event) {
        var me = this;
        //console.log('pointer click happened');

        //emit event
        return self.emitEvent(me.target, event);
    };

});