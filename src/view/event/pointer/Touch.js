/**
 * Event class for touches, created by touch events
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Touch
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.Touch', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.imports = {
        Element: 'xs.view.Element'
    };

    Class.constructor = function (touch) {
        var me = this;

        //assert, that touch is a Touch interface instance
        self.assert.object(touch, 'constructor - given `$touch` is not an object', {
            $touch: touch
        });


        //verify and set properties from touch

        //assert, that touch.identifier is a number
        self.assert.number(touch.identifier, 'constructor - given touch.identifier `$identifier` is not a number', {
            $identifier: touch.identifier
        });
        me.private.id = touch.identifier;

        //assert, that touch.screenX is a number
        self.assert.number(touch.screenX, 'constructor - given touch.screenX `$screenX` is not a number', {
            $screenX: touch.screenX
        });
        me.private.screenX = touch.screenX;

        //assert, that touch.screenY is a number
        self.assert.number(touch.screenY, 'constructor - given touch.screenY `$screenY` is not a number', {
            $screenY: touch.screenY
        });
        me.private.screenY = touch.screenY;

        //assert, that touch.clientX is a number
        self.assert.number(touch.clientX, 'constructor - given touch.clientX `$clientX` is not a number', {
            $clientX: touch.clientX
        });
        me.private.clientX = touch.clientX;

        //assert, that touch.clientY is a number
        self.assert.number(touch.clientY, 'constructor - given touch.clientY `$clientY` is not a number', {
            $clientY: touch.clientY
        });
        me.private.clientY = touch.clientY;

        //assert, that touch.target is an Element instance
        self.assert.ok(touch.target instanceof window.EventTarget, 'constructor - given touch.target `$target` is not a `$Element` instance', {
            $target: touch.target,
            $Element: Element
        });
        me.private.target = touch.target;
    };

    /**
     * A unique identifier for this Touch object.
     * A given touch (say, by a finger) will have the same identifier for the duration of its movement around the surface.
     * This lets you ensure that you're tracking the same touch all the time. Read only.
     *
     * @type {Number}
     */
    Class.property.id = {
        set: xs.noop
    };

    /**
     * The X coordinate of the touch point relative to the left edge of the screen. Read only.
     *
     * @type {Number}
     */
    Class.property.screenX = {
        set: xs.noop
    };

    /**
     * The Y coordinate of the touch point relative to the top edge of the screen. Read only.
     *
     * @type {Number}
     */
    Class.property.screenY = {
        set: xs.noop
    };

    /**
     * The X coordinate of the touch point relative to the left edge of the browser viewport, not including any scroll offset. Read only.
     *
     * @type {Number}
     */
    Class.property.clientX = {
        set: xs.noop
    };

    /**
     * The Y coordinate of the touch point relative to the top edge of the browser viewport, not including any scroll offset. Read only.
     *
     * @type {Number}
     */
    Class.property.clientY = {
        set: xs.noop
    };

    /**
     * The Element on which the touch point started when it was first placed on the surface,
     * even if the touch point has since moved outside the interactive area of that element or even been removed from the document.
     * Note that if the target is removed from the document, events will still be targeted at it,
     * and hence won't necessarily bubble up to the window or document anymore.
     *
     * @type {xs.view.Element}
     */
    Class.property.target = {
        get: function () {
            var me = this;

            if (me.private.target instanceof window.EventTarget) {
                me.private.target = new imports.Element(me.private.target);
            }

            return me.private.target;
        },
        set: xs.noop
    };

});