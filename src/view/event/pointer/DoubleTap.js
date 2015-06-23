/**
 * Event class for events, being thrown when pointer taps
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.DoubleTap
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.DoubleTap', function (self, imports) {

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

    //minimal time between taps to be considered a doubleTap
    var doubleTapMinTime = 150;

    //maximum time between taps to be considered a doubleTap
    var doubleTapMaxTime = 700;

    //timeout after last touch end, while next click will be silenced (for touch devices' 300 ms delay)
    var doubleClickTimeout = 400;

    //tap move limit to separate tap from swipe|scroll
    var tapMoveLimit = 20;

    //TASKS
    //1. One touch after other touchstart->touchend->touchstart->touchend
    //2. Second touch becomes first if time test fails
    //3. Touch is not mentioned if move test fails
    //4. Each touch is verified for time via start/end
    //5. Gesture itself is verified with gestureStart/gestureEnd
    //4. Successful doubleTap cancels doubleClick for doubleClickTimeout

    var captureAllEvents = function (element) {
        var capture = {
            element: element,
            Event: self,
            //handleDoubleClick flag
            handleDoubleClick: true,
            //tap start and end time for single tap
            tapStart: 0,
            tapEnd: 0,
            //tap start and end time for gesture
            gestureStart: 0,
            gestureEnd: 0,
            //current taps count
            count: 0,
            //tap move
            move: {}
        };

        var el = element.private.el;

        //capture touch start
        capture.handleTouchStart = xs.bind(handleTouchStart, capture);
        el.addEventListener('touchstart', capture.handleTouchStart);

        //capture touch end
        capture.handleTouchEnd = xs.bind(handleTouchEnd, capture);
        el.addEventListener('touchend', capture.handleTouchEnd);

        //capture click
        capture.handleTouchDoubleClick = xs.bind(handleTouchDoubleClick, capture);
        el.addEventListener('click', capture.handleTouchDoubleClick);

        return capture;
    };

    //define handler for touch start event
    var handleTouchStart = function (event) {
        var me = this;

        //write start timestamp
        me.tapStart = Date.now();

        //write start position
        me.move.start = getPosition(event);

        //if not first touch in gesture - return
    };

    //define handler for touch end event
    var handleTouchEnd = function (event) {
        var me = this;

        //increase count
        me.count++;

        //if count is less, than needed - return
        if (me.count < 2) {
            return me.count++;
        }

        //write tapEnd timestamp
        me.tapEnd = Date.now();

        //check duration to match min and max doubleTap time
        var duration = me.tapEnd - me.tapStart;

        if (duration < doubleTapMinTime || duration > doubleTapMaxTime) {

            return cancelEvent(event);
        }

        //write end position
        var move = me.move;
        move.end = getPosition(event);

        //check movement
        if (Math.abs(move.start.x - move.end.x) > tapMoveLimit || Math.abs(move.start.y - move.end.y) > tapMoveLimit) {

            //cancel event
            return cancelEvent(event);
        }

        //click would not be handled within clickTimeout
        me.handleDoubleClick = false;

        //try to get bubbled event
        var xEvent = event[ self.label ];

        //upgrade bubbled event
        if (xEvent instanceof me.Event) {
            xs.apply(xEvent.private, getUpdateFromTouchEvent(event));

            //or create new
        } else {
            xEvent = new me.Event(event, getDataFromTouchEvent(event));
        }

        me.element.events.emitter.send(xEvent);
    };

    //define handler for click event
    var handleTouchDoubleClick = function (event) {
        var me = this;

        //check timeout
        if (Date.now() - me.gestureEnd < doubleClickTimeout) {

            //cancel event
            return cancelEvent(event);
        }

        //try to get bubbled event
        var xEvent = event[ self.label ];

        //upgrade bubbled event
        if (xEvent instanceof me.Event) {
            xs.apply(xEvent.private, getUpdateFromPointerEvent(event));

            //or create new
        } else {
            xEvent = new me.Event(event, getDataFromPointerEvent(event));
        }

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
        capture.handlePointerDoubleClick = xs.bind(handlePointerDoubleClick, capture);
        element.private.el.addEventListener('click', capture.handlePointerDoubleClick);

        return capture;
    };

    //define handle for `click` event
    var handlePointerDoubleClick = function (event) {
        var me = this;

        //try to get bubbled event
        var xEvent = event[ self.label ];

        //upgrade bubbled event
        if (xEvent instanceof me.Event) {
            xs.apply(xEvent.private, getUpdateFromPointerEvent(event));

            //or create new
        } else {
            xEvent = new me.Event(event, getDataFromPointerEvent(event));
        }

        me.element.events.emitter.send(xEvent);
    };

    var releaseAllEvents = function (element, capture) {
        element.private.el.removeEventListener('touchstart', capture.handleTouchStart);
        element.private.el.removeEventListener('touchend', capture.handleTouchEnd);
        element.private.el.removeEventListener('click', capture.handleTouchDoubleClick);
    };

    var releasePointerEvents = function (element, capture) {
        element.private.el.removeEventListener('click', capture.handlePointerDoubleClick);
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