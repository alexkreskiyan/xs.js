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

    //time between touch start and touch end, that is considered as a click
    var tapTime = 150;

    //minimal time between taps to be considered a doubleTap
    var doubleTapMinTime = 150;

    //maximum time between taps to be considered a doubleTap
    var doubleTapMaxTime = 700;

    //timeout after last touch end, while next click will be silenced (for touch devices' 300 ms delay)
    var doubleClickTimeout = 400;

    //tap move limit to separate tap from swipe|scroll
    var tapMoveLimit = 20;

    var captureAllEvents = function (element) {
        var capture = {
            element: element,
            Event: self,
            //taps stack
            taps: [],
            //last touch-based doubleTap time
            lastTime: 0
        };

        var el = element.private.el;

        //capture touch start
        capture.handleTouchStart = xs.bind(handleTouchStart, capture);
        el.addEventListener('touchstart', capture.handleTouchStart);

        //capture touch end
        capture.handleTouchEnd = xs.bind(handleTouchEnd, capture);
        el.addEventListener('touchend', capture.handleTouchEnd);
        el.addEventListener('touchcancel', capture.handleTouchEnd);

        //capture click
        capture.handleTouchDoubleClick = xs.bind(handleTouchDoubleClick, capture);
        el.addEventListener('dblclick', capture.handleTouchDoubleClick);

        return capture;
    };

    //define handler for touch start event
    var handleTouchStart = function (event) {
        var me = this;

        var taps = me.taps;

        //console.log('touchStart registered. Clean up taps', taps, ' from unfinished ones');

        //remove all taps in stack, that have not been completed
        var i = 0;

        while (i < me.taps.length) {
            var tap = taps[ i ];

            //if timeEnd defined - go to next
            if (tap.timeEnd) {
                //console.log('tap', tap, 'is finished, go to next');
                i++;
                //else - splice
            } else {
                //console.log('tap', tap, 'is unfinished, splice it from taps');
                taps.splice(i, 1);
            }
        }

        //console.log('taps after cleanup:', taps);
        //console.log('touchStart registered. Id:', event.changedTouches[ 0 ].identifier, 'time:', Date(Date.now()), ', pos:', getPosition(event));

        //push new tap to taps
        taps.push({
            id: event.changedTouches[ 0 ].identifier,
            timeStart: Date.now(),
            posStart: getPosition(event)
        });
    };

    //define handler for touch end event
    var handleTouchEnd = function (event) {
        var me = this;

        var taps = me.taps;

        //find relative tap
        var id = event.changedTouches[ 0 ].identifier;

        //console.log('touchEnd registered. Id:', id, 'time:', Date(Date.now()), ', pos:', getPosition(event));
        //console.log('try to find relative tap in taps', taps);

        var tap = taps.filter(function (tap) {
            return !tap.timeEnd && tap.id === id;
        })[ 0 ];

        //if no relative tap - return
        if (!tap) {
            //console.log('no relative tap found with id', id, '. return');

            return;
        }

        //upgrade tap time and position
        tap.timeEnd = Date.now();
        tap.posEnd = getPosition(event);

        //if tap moved or timed out - remove it
        if (tap.timeEnd - tap.timeStart > tapTime || hasMoved(tap.posStart, tap.posEnd, tapMoveLimit)) {
            //if (tap.timeEnd - tap.timeStart > tapTime) {
            //console.log('touchEnd timed out:', tap.timeEnd - tap.timeStart, '>', tapTime);
            //} else {
            //console.log('touchEnd moved. x:', tap.posEnd.x - tap.posStart.x, 'y:', tap.posEnd.y - tap.posStart.y);
            //}
            //console.log('remove tap', tap, 'from taps', taps);
            taps.splice(taps.indexOf(tap), 1);
            //console.log('taps:', taps, '. return');

            return;
        }

        //console.log('tap is ok, check taps count');

        //if taps count is less, than needed - return
        if (taps.length < 2) {
            //console.log('taps count is not enough:', taps.length, '. return');

            return;
        }

        //console.log('taps count is ok. check gesture');

        //enough taps to emit doubleTap. needed movement and timeout validation

        //shift first tap from taps
        var firstTap = taps.shift();

        //evaluate duration and positions
        var duration = tap.timeEnd - firstTap.timeStart;
        var posStart = {
            x: (firstTap.posStart.x + firstTap.posEnd.x) / 2,
            y: (firstTap.posStart.y + firstTap.posEnd.y) / 2
        };
        var posEnd = {
            x: (tap.posStart.x + tap.posEnd.x) / 2,
            y: (tap.posStart.y + tap.posEnd.y) / 2
        };

        //if taps duration is not in time limits or move exceeded - return.
        //First tap is already shifted from taps and it contains only last tap
        if (duration < doubleTapMinTime || duration > doubleTapMaxTime || hasMoved(posStart, posEnd, tapMoveLimit)) {
            //if (duration < doubleTapMinTime) {
            //console.log('Gesture is too fast:', duration, '<', doubleTapMinTime);
            //} else if (duration > doubleTapMaxTime) {
            //console.log('Gesture is too slow:', duration, '>', doubleTapMaxTime);
            //} else {
            //console.log('Gesture moved. x:', posEnd.x - posStart.x, 'y:', posEnd.y - posStart.y);
            //}

            return;
        }


        //all is ok, doubleTap will be emitted

        //reset taps array
        taps.splice(0);

        //set lastTime
        me.lastTime = tap.timeEnd;
        //console.log('Last time set to', Date(me.lastTime));

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

        //console.log('fire tap event from touch...');
        me.element.events.emitter.send(xEvent);
    };

    //define handler for click event
    var handleTouchDoubleClick = function (event) {
        var me = this;

        //console.log('touch doubleClick happened');
        //check timeout
        if (Date.now() - me.lastTime < doubleClickTimeout) {
            //console.log('touch click is duplicate. Time diff:', Date.now() - me.lastTime, '<', doubleClickTimeout);

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

        //console.log('fire tap event from pointer...');
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

    var hasMoved = function (start, end, moveLimit) {
        return Math.abs(start.x - end.x) > moveLimit || Math.abs(start.y - end.y) > moveLimit;
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
        element.private.el.addEventListener('dblclick', capture.handlePointerDoubleClick);

        return capture;
    };

    //define handle for `click` event
    var handlePointerDoubleClick = function (event) {
        var me = this;
        //console.log('pointer doubleClick happened');

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

        //console.log('fire tap event from pointer...');
        me.element.events.emitter.send(xEvent);
    };

    var releaseAllEvents = function (element, capture) {
        element.private.el.removeEventListener('touchstart', capture.handleTouchStart);
        element.private.el.removeEventListener('touchend', capture.handleTouchEnd);
        element.private.el.removeEventListener('touchcancel', capture.handleTouchEnd);
        element.private.el.removeEventListener('dblclick', capture.handleTouchDoubleClick);
    };

    var releasePointerEvents = function (element, capture) {
        element.private.el.removeEventListener('dblclick', capture.handlePointerDoubleClick);
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