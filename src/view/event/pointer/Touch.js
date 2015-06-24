/**
 * Event class for touches, created by touch events
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Touch
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.Touch', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.constructor = function (touch) {
        var me = this;

        self.assert.ok(touch instanceof );
    };

    Touch.identifier
    A unique identifier for this Touch object. A given touch (say, by a finger) will have the same identifier for the duration of its movement around the surface. This lets you ensure that you're tracking the same touch all the time. Read only.

    Touch.screenX
    The X coordinate of the touch point relative to the left edge of the screen. Read only.

    Touch.screenY
    The Y coordinate of the touch point relative to the top edge of the screen. Read only.

    Touch.clientX
    The X coordinate of the touch point relative to the left edge of the browser viewport, not including any scroll offset. Read only.

    Touch.clientY
    The Y coordinate of the touch point relative to the top edge of the browser viewport, not including any scroll offset. Read only.

    Touch.target
    The Element on which the touch point started when it was first placed on the surface, even if the touch point has since moved outside the interactive area of that element or even been removed from the document. Note that if the target is removed from the document, events will still be targeted at it, and hence won't necessarily bubble up to the window or document anymore. If there's any risk of an element being removed while it is being touched, best practice is to attach the touch listeners directly to the target. Read only.
});