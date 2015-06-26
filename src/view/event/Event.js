xs.define(xs.Class, 'ns.Event', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.imports = {
        Element: 'xs.view.Element',
        Phase: 'ns.Phase'
    };

    Class.implements = [
        'ns.IEvent'
    ];

    Class.abstract = true;

    Class.static.method.capture = function (element) {

    };

    Class.static.method.release = function (element, capture) {

    };

    Class.static.method.getEventData = function (event) {
        var data = {};

        //assert, that given event is a Event instance
        self.assert.ok(event instanceof Event, 'constructor - given data.currentTarget `$currentTarget` is not a Event instance', {
            $event: event
        });

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

        return data;
    };

    Class.static.method.getEventUpdate = function (event) {
        var data = {};

        //assert, that given event is a Event instance
        self.assert.ok(event instanceof Event, 'constructor - given data.currentTarget `$currentTarget` is not a Event instance', {
            $event: event
        });

        data.currentTarget = event.currentTarget;
        data.phase = event.eventPhase;

        return data;
    };

    Class.static.method.cancelEvent = function (event) {
        if (event.cancelable) {
            event.preventDefault();
        }

        event.stopPropagation();

        return false;
    };

    Class.static.method.emitEvent = function (element, event) {
        var me = this;
        var XEvent = me;

        //try to get bubbled event
        var xEvent = event[ me.label ];

        //upgrade bubbled event
        if (xEvent instanceof XEvent) {
            xs.apply(xEvent.private, me.getEventUpdate(event));

            //or create new
        } else {
            xEvent = new XEvent(event, me.getEventData(event));
        }

        return element.events.emitter.send(xEvent);
    };

    Class.constructor = function (event, data) {
        var me = this;

        //assert, that given event is a Event instance
        self.assert.ok(event instanceof Event, 'constructor - given data.currentTarget `$currentTarget` is not a Event instance', {
            $event: event
        });

        //inject to dom event
        event[ me.self.label ] = me;

        //assert, that given data is an object
        self.assert.object(data, 'constructor - given data `$data` is not an object', {
            $data: data
        });


        //validate and save event fields

        //bubbles
        self.assert.boolean(data.bubbles, 'constructor - given data.bubbles `$bubbles` is not a boolean', {
            $bubbles: data.bubbles
        });
        me.private.bubbles = data.bubbles;

        //cancelable
        self.assert.boolean(data.cancelable, 'constructor - given data.cancelable `$cancelable` is not a boolean', {
            $cancelable: data.cancelable
        });
        me.private.cancelable = data.cancelable;

        //currentTarget
        self.assert.ok(data.currentTarget instanceof Element, 'constructor - given data.currentTarget `$currentTarget` is not a `$Element` instance', {
            $currentTarget: data.currentTarget,
            $Element: Element
        });
        me.private.currentTarget = data.currentTarget;

        //defaultPrevented
        me.private.defaultPrevented = false;

        //phase
        me.private.phase = data.phase;

        //target
        self.assert.ok(data.target instanceof Element, 'constructor - given data.target `$target` is not a `$Element` instance', {
            $target: data.target,
            $Element: Element
        });
        me.private.target = data.target;

        //time
        self.assert.ok(data.time instanceof Date, 'constructor - given data.time `$time` is not a Date instance', {
            $time: data.time
        });
        me.private.time = data.time;


        //validate and save event methods

        //preventDefault
        self.assert.ok(!me.cancelable || xs.isFunction(data.preventDefault), 'constructor - given data.preventDefault `$preventDefault` is not a function', {
            $preventDefault: data.preventDefault
        });

        //stopPropagation
        self.assert.fn(data.stopPropagation, 'constructor - given data.stopPropagation `$stopPropagation` is not a function', {
            $preventDefault: data.stopPropagation
        });
    };

    /**
     * A boolean indicating whether the event bubbles up through the DOM or not
     */
    Class.property.bubbles = {
        set: xs.noop
    };

    /**
     * A boolean indicating whether the event is cancelable
     */
    Class.property.cancelable = {
        set: xs.noop
    };

    /**
     * The EventTarget whose EventListeners are currently being processed.
     * As the event capturing and bubbling occurs this value changes.
     */
    Class.property.currentTarget = {
        get: function () {
            var me = this;

            if (me.private.currentTarget instanceof Element) {
                me.private.currentTarget = new imports.Element(me.private.currentTarget);
            }

            return me.private.currentTarget;
        },
        set: xs.noop
    };

    /**
     * Indicates whether or not event.preventDefault() has been called on the event
     */
    Class.property.defaultPrevented = {
        set: xs.noop
    };

    /**
     * Indicates which phase of the event flow is being processed
     */
    Class.property.phase = {
        get: function () {
            return getPhase(this.private.phase);
        },
        set: xs.noop
    };

    /**
     * A reference to the target DOM element that triggered this event
     */
    Class.property.target = {
        get: function () {
            var me = this;

            if (me.private.target instanceof Element) {
                me.private.target = new imports.Element(me.private.target);
            }

            return me.private.target;
        },
        set: xs.noop
    };

    /**
     * The time that the event was created
     */
    Class.property.time = {
        set: xs.noop
    };

    /**
     * Cancels the event (if it is cancelable)
     */
    Class.method.preventDefault = function () {
        var me = this;

        //assert, that event is cancelable
        self.assert.ok(me.cancelable, 'preventDefault - event `$event` is not cancelable', {
            $event: me
        });

        //assert, that event is not prevented yet
        self.assert.not(me.defaultPrevented, 'preventDefault - event `$event` is already prevented', {
            $event: me
        });

        me.private.defaultPrevented = true;

        me.private.preventDefault();
    };

    /**
     * Prevents further propagation of the current event along in the DOM
     *
     * To release stopImmediatePropagation, return false in event handler
     */
    Class.method.stopPropagation = function () {
        return this.private.stopPropagation();
    };

    var getPhase = function (phase) {
        switch (phase) {
            case 1:
                return imports.Phase.Capture;
            case 2:
                return imports.Phase.Target;
            default:
                return imports.Phase.Bubble;
        }
    };

});