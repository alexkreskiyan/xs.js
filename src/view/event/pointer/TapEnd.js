/**
 * Event class for events, being thrown when pointer tap ends
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.TapEnd
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.TapEnd', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.pointer.Pointer';

    Class.imports = {
        Button: 'ns.pointer.Button',
        Touch: 'ns.pointer.Touch'
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

    //timeout after touchEnd/touchCancel, while pointerUp events will be ignored
    var pointerUpTimeout = 400;

    var captureAllEvents = function (element) {
        var capture = {
            element: element,
            Event: self,
            //write last tapEnd time
            lastTime: 0
        };

        var el = element.private.el;

        //capture touch end
        capture.handleTouchEnd = xs.bind(handleTouchEnd, capture);
        el.addEventListener('touchend', capture.handleTouchEnd);
        el.addEventListener('touchcancel', capture.handleTouchEnd);

        //capture pointerUp
        capture.handleTouchPointerUp = xs.bind(handleTouchPointerUp, capture);
        el.addEventListener(self.parent.pointerEvents.pointerUp, capture.handleTouchPointerUp);

        return capture;
    };

    //define handler for touch end event
    var handleTouchEnd = function (event) {
        var me = this;
        //console.log('touchEnd registered. Time:', Date(me.timeEnd));

        //write touchEnd time
        me.timeEnd = Date.now();

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

        //console.log('fire tapEnd event from touch...');
        me.element.events.emitter.send(xEvent);
    };

    //define handler for pointerUp event
    var handleTouchPointerUp = function (event) {
        var me = this;

        //console.log('touch pointerUp happened');
        //check timeout
        if (Date.now() - me.timeEnd < pointerUpTimeout) {
            //console.log('touch pointerUp is duplicate. Time diff:', Date.now() - me.timeEnd, '<', pointerUpTimeout);

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

        //console.log('fire tapEnd event from pointer...');
        me.element.events.emitter.send(xEvent);
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

        //capture pointer up event
        capture.handlePointerPointerUp = xs.bind(handlePointerPointerUp, capture);
        element.private.el.addEventListener(self.parent.pointerEvents.pointerUp, capture.handlePointerPointerUp);

        return capture;
    };

    //define handle for `click` event
    var handlePointerPointerUp = function (event) {
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

        //console.log('fire tapEnd event from pointer...');
        me.element.events.emitter.send(xEvent);
    };

    var releaseAllEvents = function (element, capture) {
        element.private.el.removeEventListener('touchend', capture.handleTouchEnd);
        element.private.el.removeEventListener('touchcancel', capture.handleTouchEnd);
        element.private.el.removeEventListener(self.parent.pointerEvents.pointerUp, capture.handleTouchPointerUp);
    };

    var releasePointerEvents = function (element, capture) {
        element.private.el.removeEventListener(self.parent.pointerEvents.pointerUp, capture.handlePointerPointerUp);
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

        me.private.isTouch = 'touches' in event;

        //all other properties are relative for touch events
        if (!me.private.isTouch) {
            me.private.touches = new xs.core.Collection();
            me.private.targetTouches = new xs.core.Collection();
            me.private.changedTouches = new xs.core.Collection();

            return;
        }

        //validate and save event fields

        //touches
        self.assert.fn(event.touches.item, 'constructor - given event.touches `$touches` is not valid', {
            $touches: event.touches
        });
        me.private.touches = event.touches;

        //targetTouches
        self.assert.fn(event.targetTouches.item, 'constructor - given event.targetTouches `$touches` is not valid', {
            $touches: event.touches
        });
        me.private.targetTouches = event.targetTouches;

        //changedTouches
        self.assert.fn(event.changedTouches.item, 'constructor - given event.changedTouches `$touches` is not valid', {
            $touches: event.touches
        });
        me.private.changedTouches = event.changedTouches;

    };

    Class.property.isTouch = {
        set: xs.noop
    };

    Class.property.touches = {
        get: function () {
            var me = this;
            var touches = me.private.touches;

            if (!(touches instanceof xs.core.Collection)) {
                var collection = new xs.core.Collection();

                for (var i = 0; i < touches.length; i++) {
                    collection.add(new imports.Touch(touches.item(i)));
                }

                touches = me.private.touches = collection;
            }

            return touches;
        },
        set: xs.noop
    };

    Class.property.targetTouches = {
        get: function () {
            var me = this;
            var touches = me.private.targetTouches;

            if (!(touches instanceof xs.core.Collection)) {
                var collection = new xs.core.Collection();

                for (var i = 0; i < touches.length; i++) {
                    collection.add(new imports.Touch(touches.item(i)));
                }

                touches = me.private.targetTouches = collection;
            }

            return touches;
        },
        set: xs.noop
    };

    Class.property.changedTouches = {
        get: function () {
            var me = this;
            var touches = me.private.changedTouches;

            if (!(touches instanceof xs.core.Collection)) {
                var collection = new xs.core.Collection();

                for (var i = 0; i < touches.length; i++) {
                    collection.add(new imports.Touch(touches.item(i)));
                }

                touches = me.private.changedTouches = collection;
            }

            return touches;
        },
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