/**
 * Event class for events, being thrown when pointer taps
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Tap
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Tap', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event.pointer';

    Class.implements = [
        'ns.IEvent'
    ];

    Class.static.method.forward = function (element) {
        var Tap = self;

        var capture = {};

        //handle touch and pointer devices differently
        if (xs.isTouch) {
            //tap timeout
            var timeout = 150;
            var fire = false;

            var timeoutId;

            //define handler for `touchstart` event
            capture.handleStart = function () {
                //mark timeout start
                fire = true;
                timeoutId = setTimeout(reset, timeout);
            };

            //define handler for `touchend` event
            capture.handleEnd = function () {
                //reset previous timeout
                clearTimeout(timeoutId);

                //if not timed out - fire event
                if (fire) {
                    element.events.emitter.send(new Tap());
                }
            };
            var reset = function () {
                fire = false;
            };

            element.private.el.addEventListener('touchstart', capture.handleStart);
            element.private.el.addEventListener('touchend', capture.handleEnd);

        } else {
            //define handle for `click` event
            capture.handle = function () {
                element.events.emitter.send(new Tap());
            };

            element.private.el.addEventListener('click', capture.handle);
        }

        return capture;
    };

    Class.static.method.release = function (element, capture) {
        if (xs.isTouch) {
            element.private.el.removeEventListener('touchstart', capture.handle);
            element.private.el.removeEventListener('touchend', capture.handle);
        } else {
            element.private.el.removeEventListener('click', capture.handle);
        }
    };

    /**
     * Event constructor
     *
     * @constructor
     *
     * @param {Object} event event data
     */
    Class.constructor = function () {
        var me = this;

        if (!arguments.length) {

            return;
        }

        //check data
        //assert that data is object
        self.assert.ok(xs.isObject(data), 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assign attributes
        me.private.attribute = data.attribute;
        me.private.old = data.old;
        me.private.new = data.new;
    };

    /**
     * Event `attribute` property. Event attribute is name of changed attribute
     *
     * @property attribute
     *
     * @type {Object}
     */
    Class.property.attribute = {
        set: xs.noop
    };

    /**
     * Event `old` property. Event old is old value at given position
     *
     * @property old
     *
     * @type {Object}
     */
    Class.property.old = {
        set: xs.noop
    };

    /**
     * Event `new` property. Event new is a value, that replaces current one
     *
     * @property new
     *
     * @type {Object}
     */
    Class.property.new = {
        set: xs.noop
    };

});