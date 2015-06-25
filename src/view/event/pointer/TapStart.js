/**
 * Event class for events, being thrown when pointer tap starts
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.TapStart
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.TapStart', function (self, imports) {

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

    //timeout after touchstart, while pointerDown events will be ignored
    var pointerDownTimeout = 400;

    var captureAllEvents = function (element) {
        var capture = {
            element: element,
            Event: self,
            //write last tapStart time
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

        //capture mouseDown
        capture.handleTouchPointerDown = xs.bind(handleTouchPointerDown, capture);
        el.addEventListener(self.parent.pointerEvents.pointerDown, capture.handleTouchPointerDown);

        return capture;
    };

    //define handler for touch start event
    var handleTouchStart = function (event) {
        var me = this;
        //console.log('touchStart registered. Time:', Date(Date.now()));

        //write touchStart time
        me.timeStart = Date.now();

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

        //console.log('fire tapStart event from touch...');
        me.element.events.emitter.send(xEvent);
    };

    //define handler for touch end event
    var handleTouchEnd = function () {
        var me = this;

        //write end timestamp
        me.timeEnd = Date.now();

        //console.log('touchEnd registered. Time:', Date(me.timeEnd));
    };

    //define handler for pointerDown event
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

        //console.log('fire tapStart event from pointer...');
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

        //capture touch start
        capture.handlePointerPointerDown = xs.bind(handlePointerPointerDown, capture);
        element.private.el.addEventListener(self.parent.pointerEvents.pointerDown, capture.handlePointerPointerDown);

        return capture;
    };

    //define handle for `click` event
    var handlePointerPointerDown = function (event) {
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

        //console.log('fire tapStart event from pointer...');
        me.element.events.emitter.send(xEvent);
    };

    var releaseAllEvents = function (element, capture) {
        element.private.el.removeEventListener('touchstart', capture.handleTouchStart);
        element.private.el.removeEventListener('touchend', capture.handleTouchEnd);
        element.private.el.removeEventListener('touchcancel', capture.handleTouchEnd);
        element.private.el.removeEventListener(self.parent.pointerEvents.pointerDown, capture.handleTouchPointerDown);
    };

    var releasePointerEvents = function (element, capture) {
        element.private.el.removeEventListener(self.parent.pointerEvents.pointerDown, capture.handlePointerPointerDown);
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

        me.private.isTouch = event instanceof window.TouchEvent;

        //all other properties are relative for touch events
        if (!me.private.isTouch) {
            me.private.touches = new xs.core.Collection();
            me.private.targetTouches = new xs.core.Collection();
            me.private.changedTouches = new xs.core.Collection();

            return;
        }

        //validate and save event fields

        //touches
        self.assert.ok(event.touches instanceof window.TouchList, 'constructor - given event.touches `$touches` is not a `$TouchList` instance', {
            $touches: event.touches,
            $TouchList: window.TouchList
        });
        me.private.touches = event.touches;

        //targetTouches
        self.assert.ok(event.targetTouches instanceof window.TouchList, 'constructor - given event.targetTouches `$touches` is not a `$TouchList` instance', {
            $touches: event.targetTouches,
            $TouchList: window.TouchList
        });
        me.private.targetTouches = event.targetTouches;

        //changedTouches
        self.assert.ok(event.changedTouches instanceof window.TouchList, 'constructor - given event.changedTouches `$touches` is not a `$TouchList` instance', {
            $touches: event.changedTouches,
            $TouchList: window.TouchList
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

            if (touches instanceof window.TouchList) {
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
            var targetTouches = me.private.targetTouches;

            if (targetTouches instanceof window.TouchList) {
                var collection = new xs.core.Collection();

                for (var i = 0; i < targetTouches.length; i++) {
                    collection.add(new imports.Touch(targetTouches.item(i)));
                }

                targetTouches = me.private.targetTouches = collection;
            }

            return targetTouches;
        },
        set: xs.noop
    };

    Class.property.changedTouches = {
        get: function () {
            var me = this;
            var changedTouches = me.private.changedTouches;

            if (changedTouches instanceof window.TouchList) {
                var collection = new xs.core.Collection();

                for (var i = 0; i < changedTouches.length; i++) {
                    collection.add(new imports.Touch(changedTouches.item(i)));
                }

                changedTouches = me.private.changedTouches = collection;
            }

            return changedTouches;
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