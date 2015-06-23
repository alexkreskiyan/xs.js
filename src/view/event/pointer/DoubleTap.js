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

    Class.extends = 'ns.Event';

    Class.imports = {
        Button: 'ns.pointer.Button'
    };

    Class.implements = [
        'ns.pointer.IEvent'
    ];

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

    //timeout after last touch end, while next click will be silenced (for touch devices' 300 ms delay)
    var clickTimeout = 400;

    //tap move limit to separate tap from swipe|scroll
    var tapMoveLimit = 20;

    var captureAllEvents = function (element) {
        var capture = {
            element: element,
            Event: self,
            //handleClick flag
            handleClick: true,
            //tap start and end time
            start: 0,
            end: 0,
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
        capture.handleTouchClick = xs.bind(handleTouchClick, capture);
        el.addEventListener('click', capture.handleTouchClick);

        return capture;
    };

    //define handler for touch start event
    var handleTouchStart = function (event) {
        var me = this;

        //write start timestamp
        me.start = Date.now();

        //write start position
        me.move.start = getPosition(event);
    };

    //define handler for touch end event
    var handleTouchEnd = function (event) {
        var me = this;

        //write end timestamp
        me.end = Date.now();

        //check tap time
        if (me.end - me.start > tapTime) {

            //cancel event
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
        me.handleClick = false;

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
    var handleTouchClick = function (event) {
        var me = this;

        //check timeout
        if (Date.now() - me.end < clickTimeout) {

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
        capture.handlePointerClick = xs.bind(handlePointerClick, capture);
        element.private.el.addEventListener('click', capture.handlePointerClick);

        return capture;
    };

    //define handle for `click` event
    var handlePointerClick = function (event) {
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
        element.private.el.removeEventListener('click', capture.handleTouchClick);
    };

    var releasePointerEvents = function (element, capture) {
        element.private.el.removeEventListener('click', capture.handlePointerClick);
    };

    /**
     * Event constructor
     *
     * @constructor
     *
     * @param {Object} event owned event
     * @param {Object} data evaluated data
     */
    Class.constructor = function (event, data) {
        var me = this;

        //call parent constructor
        self.parent.call(me, event, data);


        //validate and save event fields

        //screenX
        self.assert.number(data.screenX, 'constructor - given data.screenX `$screenX` is not a number', {
            $screenX: data.screenX
        });
        me.private.screenX = data.screenX;

        //screenY
        self.assert.number(data.screenY, 'constructor - given data.screenY `$screenY` is not a number', {
            $screenY: data.screenY
        });
        me.private.screenY = data.screenY;

        //clientX
        self.assert.number(data.clientX, 'constructor - given data.clientX `$clientX` is not a number', {
            $clientX: data.clientX
        });
        me.private.clientX = data.clientX;

        //clientY
        self.assert.number(data.clientY, 'constructor - given data.clientY `$clientY` is not a number', {
            $clientY: data.clientY
        });
        me.private.clientY = data.clientY;

        //button
        self.assert.ok(imports.Button.has(data.button), 'constructor - given data.button `$button` is not button identifier', {
            $button: data.button
        });
        me.private.button = data.button;

        //ctrlKey
        self.assert.boolean(data.ctrlKey, 'constructor - given data.ctrlKey `$ctrlKey` is not a boolean', {
            $ctrlKey: data.ctrlKey
        });
        me.private.ctrlKey = data.ctrlKey;

        //altKey
        self.assert.boolean(data.altKey, 'constructor - given data.altKey `$altKey` is not a boolean', {
            $altKey: data.altKey
        });
        me.private.altKey = data.altKey;

        //shiftKey
        self.assert.boolean(data.shiftKey, 'constructor - given data.shiftKey `$shiftKey` is not a boolean', {
            $shiftKey: data.shiftKey
        });
        me.private.shiftKey = data.shiftKey;

        //metaKey
        self.assert.boolean(data.metaKey, 'constructor - given data.metaKey `$metaKey` is not a boolean', {
            $metaKey: data.metaKey
        });
        me.private.metaKey = data.metaKey;
    };

    Class.property.screenX = {
        set: xs.noop
    };

    Class.property.screenY = {
        set: xs.noop
    };

    Class.property.clientX = {
        set: xs.noop
    };

    Class.property.clientY = {
        set: xs.noop
    };

    Class.property.button = {
        set: xs.noop
    };

    Class.property.ctrlKey = {
        set: xs.noop
    };

    Class.property.altKey = {
        set: xs.noop
    };

    Class.property.shiftKey = {
        set: xs.noop
    };

    Class.property.metaKey = {
        set: xs.noop
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