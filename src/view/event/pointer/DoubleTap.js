/**
 * Event class for events, being thrown when pointer taps
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.DoubleTap
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.DoubleTap', function (self) {

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

    var releaseAllEvents = function (element, capture) {
        element.private.el.removeEventListener('touchstart', capture.handleTouchStart);
        element.private.el.removeEventListener('touchend', capture.handleTouchEnd);
        element.private.el.removeEventListener('touchcancel', capture.handleTouchEnd);
        element.private.el.removeEventListener('dblclick', capture.handleTouchDoubleClick);
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

    var releasePointerEvents = function (element, capture) {
        element.private.el.removeEventListener('dblclick', capture.handlePointerDoubleClick);
    };

    //define handler for touchStart event
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
        //console.log('touchStart registered. Id:', event.changedTouches[ 0 ].identifier, 'time:', Date(Date.now()), ', pos:', self.getEventPosition(event));

        //push new tap to taps
        taps.push({
            id: event.changedTouches[ 0 ].identifier,
            timeStart: Date.now(),
            posStart: self.getEventPosition(event)
        });
    };

    //define handler for touchEnd event
    var handleTouchEnd = function (event) {
        var me = this;

        var taps = me.taps;

        //find relative tap
        var id = event.changedTouches[ 0 ].identifier;

        //console.log('touchEnd registered. Id:', id, 'time:', Date(Date.now()), ', pos:', self.getEventPosition(event));
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
        tap.posEnd = self.getEventPosition(event);

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

        //emit event
        return self.emitEvent(me.element, event);
    };

    //define handler for doubleClick event on touch device
    var handleTouchDoubleClick = function (event) {
        var me = this;

        //console.log('touch doubleClick happened');
        //check timeout
        if (Date.now() - me.lastTime < doubleClickTimeout) {
            //console.log('touch doubleClick is duplicate. Time diff:', Date.now() - me.lastTime, '<', doubleClickTimeout);

            //cancel event
            return self.cancelEvent(event);
        }

        //emit event
        return self.emitEvent(me.element, event);
    };

    //define handler for doubleClick event on non-touch device
    var handlePointerDoubleClick = function (event) {
        var me = this;
        //console.log('pointer doubleClick happened');

        //emit event
        return self.emitEvent(me.element, event);
    };

    var hasMoved = function (start, end, moveLimit) {
        return Math.abs(start.x - end.x) > moveLimit || Math.abs(start.y - end.y) > moveLimit;
    };

});