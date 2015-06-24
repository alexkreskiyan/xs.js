/**
 * Event class for events, being thrown when pointer taps
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.ContextMenu
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.ContextMenu', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.pointer.Pointer';

    Class.imports = {
        Button: 'ns.pointer.Button'
    };

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

        //capture contextMenu
        capture.handleTouchContextMenu = xs.bind(handleTouchContextMenu, capture);
        el.addEventListener('contextmenu', capture.handleTouchContextMenu);

        return capture;
    };

    //define handler for touch start event
    var handleTouchStart = function (event) {
        var me = this;

        //write start timestamp
        me.timeStart = Date.now();

        //write start position
        me.posStart = getPosition(event);
        //console.log('touchStart registered. Time:', Date(me.timeStart), ', pos:', me.posStart);
    };

    //define handler for touch end event
    var handleTouchEnd = function (event) {
        var me = this;

        //write end timestamp
        me.timeEnd = Date.now();

        //console.log('touchEnd registered. Time:', Date(me.timeEnd));

        //check gesture time
        if (me.timeEnd - me.timeStart < contextMenuTime) {
            //console.log('touchEnd too early:', me.timeEnd - me.timeStart, '<', contextMenuTime);

            //cancel event
            return cancelEvent(event);
        }

        //write end position
        var posStart = me.posStart;
        var posEnd = me.posEnd = getPosition(event);

        //console.log('touchEnd pos:', posEnd);

        //check movement
        if (Math.abs(posEnd.x - posStart.x) > tapMoveLimit || Math.abs(posEnd.y - posStart.y) > tapMoveLimit) {
            //console.log('touch moved. x:', posEnd.x - posStart.x, 'y:', posEnd.y - posStart.y);

            //cancel event
            return cancelEvent(event);
        }

        //try to get bubbled event
        var xEvent = event[ self.label ];

        //upgrade bubbled event
        if (xEvent instanceof me.Event) {
            //console.log('update bubbling event from touch. Target:', event.target, 'current:', event.currentTarget);
            xs.apply(xEvent.private, getUpdateFromTouchEvent(event));

            //or create new
        } else {
            //console.log('create new event from touch. Target:', event.target, 'current:', event.currentTarget);
            xEvent = new me.Event(event, getDataFromTouchEvent(event));
        }

        //console.log('fire contextMenu event from touch...');
        me.element.events.emitter.send(xEvent);
    };

    //define handler for contextMenu event
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
            return cancelEvent(event);
        }

        //try to get bubbled event
        var xEvent = event[ self.label ];

        //upgrade bubbled event
        if (xEvent instanceof me.Event) {
            //console.log('update bubbling event from pointer. Target:', event.target, 'current:', event.currentTarget);
            xs.apply(xEvent.private, getUpdateFromPointerEvent(event));

            //or create new
        } else {
            //console.log('create new event from pointer. Target:', event.target, 'current:', event.currentTarget);
            xEvent = new me.Event(event, getDataFromPointerEvent(event));
        }

        //console.log('fire contextMenu event from pointer...');
        me.element.events.emitter.send(xEvent);
    };

    var getPosition = function (event) {
        //if MouseEvent
        if (event instanceof MouseEvent) {

            return {
                x: event.clientX,
                y: event.clientY
            };

            //if PointerEvent/TouchEvent
        } else {
            return {
                x: event.changedTouches[ 0 ].clientX,
                y: event.changedTouches[ 0 ].clientY
            };
        }
    };

    var cancelEvent = function (event) {
        if (event.cancelable) {
            event.preventDefault();
        }

        event.stopPropagation();

        return false;
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

    //define handle for `contextmenu` event
    var handlePointerContextMenu = function (event) {
        var me = this;
        //console.log('pointer contextMenu happened');

        //try to get bubbled event
        var xEvent = event[ self.label ];

        //upgrade bubbled event
        if (xEvent instanceof me.Event) {
            //console.log('update bubbling event from pointer. Target:', event.target, 'current:', event.currentTarget);
            xs.apply(xEvent.private, getUpdateFromPointerEvent(event));

            //or create new
        } else {
            //console.log('create new event from pointer. Target:', event.target, 'current:', event.currentTarget);
            xEvent = new me.Event(event, getDataFromPointerEvent(event));
        }

        //console.log('fire contextMenu event from pointer...');
        me.element.events.emitter.send(xEvent);
    };

    var releaseAllEvents = function (element, capture) {
        element.private.el.removeEventListener('touchstart', capture.handleTouchStart);
        element.private.el.removeEventListener('touchend', capture.handleTouchEnd);
        element.private.el.removeEventListener('contextmenu', capture.handleTouchContextMenu);
    };

    var releasePointerEvents = function (element, capture) {
        element.private.el.removeEventListener('contextmenu', capture.handlePointerContextMenu);
    };

    var getDataFromTouchEvent = function (event) {
        var data = {};

        //common
        data.bubbles = event.bubbles;
        data.cancelable = event.cancelable;
        data.currentTarget = event.currentTarget;
        data.phase = event.eventPhase;
        data.target = event.target;
        data.time = event.timestamp ? new Date(event.timestamp) : new Date();

        if (data.cancelable) {
            data.preventDefault = function () {
                event.preventDefault();
            };
        }

        data.stopPropagation = function () {
            event.stopPropagation();
        };

        //event-special
        var touch = event.changedTouches[ 0 ];
        data.screenX = touch.screenX;
        data.screenY = touch.screenY;
        data.clientX = touch.clientX;
        data.clientY = touch.clientY;
        data.button = imports.Button.Main;
        data.ctrlKey = event.ctrlKey;
        data.altKey = event.altKey;
        data.shiftKey = event.shiftKey;
        data.metaKey = event.metaKey;

        return data;
    };

    var getUpdateFromTouchEvent = function (event) {
        var data = {};

        data.currentTarget = event.currentTarget;
        data.phase = event.eventPhase;

        return data;
    };

    var getDataFromPointerEvent = function (event) {
        var data = {};

        //common
        data.bubbles = event.bubbles;
        data.cancelable = event.cancelable;
        data.currentTarget = event.currentTarget;
        data.phase = event.eventPhase;
        data.target = event.target;
        data.time = event.timestamp ? new Date(event.timestamp) : new Date();

        if (data.cancelable) {
            data.preventDefault = function () {
                event.preventDefault();
            };
        }

        data.stopPropagation = function () {
            event.stopPropagation();
        };

        //event-special
        data.screenX = event.screenX;
        data.screenY = event.screenY;
        data.clientX = event.clientX;
        data.clientY = event.clientY;
        data.button = event.button;
        data.ctrlKey = event.ctrlKey;
        data.altKey = event.altKey;
        data.shiftKey = event.shiftKey;
        data.metaKey = event.metaKey;

        return data;
    };

    var getUpdateFromPointerEvent = function (event) {
        var data = {};

        data.currentTarget = event.currentTarget;
        data.phase = event.eventPhase;

        return data;
    };

});