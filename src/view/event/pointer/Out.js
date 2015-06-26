/**
 * Event class for events, being thrown when pointer moves out of element
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Out
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.Out', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.pointer.Pointer';

    Class.imports = {
        Button: 'ns.pointer.Button',
        Element: 'xs.view.Element'
    };

    Class.static.method.capture = function (element) {
        var capture = {
            element: element,
            Event: self
        };

        //capture pointerOut event
        capture.handlePointerOut = xs.bind(handlePointerOut, capture);
        element.private.el.addEventListener(self.parent.pointerEvents.pointerOut, capture.handlePointerOut);

        return capture;
    };

    Class.static.method.release = function (element, capture) {
        element.private.el.removeEventListener(self.parent.pointerEvents.pointerOut, capture.handlePointerOut);
    };

    //define handle for `click` event
    var handlePointerOut = function (event) {
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

        //relatedTarget
        self.assert.ok(data.relatedTarget instanceof Element, 'constructor - given data.relatedTarget `$currentTarget` is not a `$Element` instance', {
            $currentTarget: data.relatedTarget,
            $Element: Element
        });
        me.private.relatedTarget = data.relatedTarget;
    };

    /**
     * The EventTarget whose EventListeners are currently being processed.
     * As the event capturing and bubbling occurs this value changes.
     */
    Class.property.relatedTarget = {
        get: function () {
            var me = this;

            if (me.private.relatedTarget instanceof Element) {
                me.private.relatedTarget = new imports.Element(me.private.relatedTarget);
            }

            return me.private.relatedTarget;
        },
        set: xs.noop
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
        data.relatedTarget = event.relatedTarget;
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
        data.relatedTarget = event.relatedTarget;
        data.phase = event.eventPhase;

        return data;
    };

});