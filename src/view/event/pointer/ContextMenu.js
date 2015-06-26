/**
 * Event class for events, being thrown when pointer taps
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.ContextMenu
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.ContextMenu', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.pointer.Pointer';

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

    //time between touch start and touch end, that needs to be gone to define a context menu
    var contextMenuTime = 320;

    //timeout after last touch end, while next contextMenu will be silenced (for touch devices' 300 ms delay)
    var contextMenuTimeout = 400;

    //tap move limit to separate tap from swipe|scroll
    var tapMoveLimit = 20;

    var captureAllEvents = function (element) {
        var capture = {
            element: element,
            Event: self,
            //tap start and end time
            timeStart: 0,
            timeEnd: 0,
            //tap move
            posStart: {},
            posEnd: {}
        };

        var el = element.private.el;

        //capture touch start
        capture.handleTouchStart = xs.bind(handleTouchStart, capture);
        el.addEventListener('touchstart', capture.handleTouchStart);

        //capture touch end
        capture.handleTouchEnd = xs.bind(handleTouchEnd, capture);
        el.addEventListener('touchend', capture.handleTouchEnd);
        el.addEventListener('touchcancel', capture.handleTouchEnd);

        //capture contextMenu
        capture.handleTouchContextMenu = xs.bind(handleTouchContextMenu, capture);
        el.addEventListener('contextmenu', capture.handleTouchContextMenu);

        return capture;
    };

    var releaseAllEvents = function (element, capture) {
        element.private.el.removeEventListener('touchstart', capture.handleTouchStart);
        element.private.el.removeEventListener('touchend', capture.handleTouchEnd);
        element.private.el.removeEventListener('touchcancel', capture.handleTouchEnd);
        element.private.el.removeEventListener('contextmenu', capture.handleTouchContextMenu);
    };

    var capturePointerEvents = function (element) {
        var capture = {
            element: element,
            Event: self
        };

        //capture touch start
        capture.handlePointerContextMenu = xs.bind(handlePointerContextMenu, capture);
        element.private.el.addEventListener('contextmenu', capture.handlePointerContextMenu);

        return capture;
    };

    var releasePointerEvents = function (element, capture) {
        element.private.el.removeEventListener('contextmenu', capture.handlePointerContextMenu);
    };

    //define handler for touchStart event
    var handleTouchStart = function (event) {
        var me = this;

        //write start timestamp
        me.timeStart = Date.now();

        //write start position
        me.posStart = self.getEventPosition(event);
        //console.log('touchStart registered. Time:', Date(me.timeStart), ', pos:', me.posStart);
    };

    //define handler for touchEnd event
    var handleTouchEnd = function (event) {
        var me = this;

        //write end timestamp
        me.timeEnd = Date.now();

        //console.log('touchEnd registered. Time:', Date(me.timeEnd));

        //check gesture time
        if (me.timeEnd - me.timeStart < contextMenuTime) {
            //console.log('touchEnd too early:', me.timeEnd - me.timeStart, '<', contextMenuTime);

            //cancel event
            return self.cancelEvent(event);
        }

        //write end position
        var posStart = me.posStart;
        var posEnd = me.posEnd = self.getEventPosition(event);

        //console.log('touchEnd pos:', posEnd);

        //check movement
        if (Math.abs(posEnd.x - posStart.x) > tapMoveLimit || Math.abs(posEnd.y - posStart.y) > tapMoveLimit) {
            //console.log('touch moved. x:', posEnd.x - posStart.x, 'y:', posEnd.y - posStart.y);

            //cancel event
            return self.cancelEvent(event);
        }

        //emit event
        return self.emitEvent(me.element, event);
    };

    //define handler for contextMenu event on touch device
    var handleTouchContextMenu = function (event) {
        var me = this;

        //console.log('touch contextMenu happened');
        //check timeout and if touch not ended
        if (me.timeStart > me.timeEnd || Date.now() - me.timeEnd < contextMenuTimeout) {
            //if (me.timeStart > me.timeEnd) {
            //console.log('touch contextMenu happened before touch was released');
            //} else {
            //console.log('touch contextMenu is duplicate. Time diff:', Date.now() - me.timeEnd, '<', contextMenuTimeout);
            //}

            //cancel event
            return self.cancelEvent(event);
        }

        //emit event
        return self.emitEvent(me.element, event);
    };

    //define handler for contextMenu event on non-touch device
    var handlePointerContextMenu = function (event) {
        var me = this;
        //console.log('pointer contextMenu happened');

        //emit event
        return self.emitEvent(me.element, event);
    };

});