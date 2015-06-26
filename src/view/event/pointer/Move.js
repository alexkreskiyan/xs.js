/**
 * Event class for events, being thrown when pointer tap starts
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Move
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.Move', function (self, imports) {

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
        el.addEventListener(self.parent.pointerEvents.pointerMove, capture.handleTouchPointerMove);

        return capture;
    };

    //define handler for touch move event
    var handleTouchMove = function (event) {
        var me = this;
        //console.log('touchEnd registered. Time:', Date(me.timeEnd));

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

        //console.log('fire move event from touch...');
        me.element.events.emitter.send(xEvent);
    };

    //define handler for pointerMove event
    var handleTouchPointerMove = function (event) {
        var me = this;

        //console.log('touch pointerMove happened');

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

        //console.log('fire move event from pointer...');
        me.element.events.emitter.send(xEvent);
    };

    var capturePointerEvents = function (element) {
        var capture = {
            element: element,
            Event: self
        };

        //capture touch start
        capture.handlePointerPointerMove = xs.bind(handlePointerPointerMove, capture);
        element.private.el.addEventListener(self.parent.pointerEvents.pointerMove, capture.handlePointerPointerMove);

        return capture;
    };

    //define handle for `click` event
    var handlePointerPointerMove = function (event) {
        var me = this;
        //console.log('pointer click happened');

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

        //console.log('fire move event from pointer...');
        me.element.events.emitter.send(xEvent);
    };

    var releaseAllEvents = function (element, capture) {
        element.private.el.removeEventListener('touchend', capture.handleTouchMove);
        element.private.el.removeEventListener('touchcancel', capture.handleTouchMove);
        element.private.el.removeEventListener(self.parent.pointerEvents.pointerMove, capture.handleTouchPointerMove);
    };

    var releasePointerEvents = function (element, capture) {
        element.private.el.removeEventListener(self.parent.pointerEvents.pointerMove, capture.handlePointerPointerMove);
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