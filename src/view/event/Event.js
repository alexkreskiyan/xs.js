xs.define(xs.Class, 'ns.Event', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event.pointer';

    Class.implements = 'ns.IEvent';

    Class.constructor = function (event) {
        var me = this;

        //assert, that event is an Event instance
        self.assert.ok(event instanceof Event, 'constructor - given not `$event` is not an Event', {
            $event: event
        });

        me.private.event = event;
    };

    /**
     * TODO is defined by descendant
     * A boolean indicating whether the event bubbles up through the DOM or not
     */
    Class.property.bubbles = {
        get: function () {
            return this.private.event.bubbles;
        }
    };

    /**
     * TODO is defined by descendant
     * A boolean indicating whether the event is cancelable
     */
    Class.property.cancelable = {
        get: function () {
            return this.private.event.cancelable;
        }
    };

    /**
     * The EventTarget whose EventListeners are currently being processed.
     * As the event capturing and bubbling occurs this value changes.
     */
    Class.property.currentTarget = {
        get: function () {
            return this.private.event.currentTarget;
        }
    };

    /**
     * Indicates whether or not event.preventDefault() has been called on the event
     */
    Class.property.defaultPrevented = {
        get: function () {
            return this.private.event.defaultPrevented;
        }
    };

    /**
     * Indicates which phase of the event flow is being processed
     */
    Class.property.phase = {
        get: function () {
            return this.private.event.eventPhase;
        }
    };

    /**
     * A reference to the target DOM element that triggered this event
     */
    Class.property.target = {
        get: function () {
            return this.private.event.target;
        }
    };

    /**
     * The time that the event was created
     */
    Class.property.time = {
        get: function () {
            return this.private.event.timestamp;
        }
    };

    /**
     * Indicates whether or not the event was initiated
     * by the browser (after a user click for instance) or
     * by a script (using an event creation method, like event.initEvent)
     */
    Class.property.isTrusted = {
        get: function () {
            return this.private.event.isTrusted;
        }
    };

    /**
     * Cancels the event (if it is cancelable)
     */
    Class.method.preventDefault = function () {
        //TODO validate cancelable
        return this.private.event.preventDefault();
    };

    /**
     * Cancels the event (if it is cancelable)
     */
    Class.method.preventDefault = function () {
        return this.private.event.preventDefault();
    };

    /**
     * For this particular event, no other listener will be called.
     * Neither those attached on the same element, nor those attached on elements,
     * which will be traversed later (in capture phase, for instance)
     */
    Class.method.stopImmediatePropagation = function () {
        return this.private.event.stopImmediatePropagation();
    };

    /**
     * Prevents further propagation of the current event along in the DOM
     */
    Class.method.stopPropagation = function () {
        return this.private.event.stopPropagation();
    };

});