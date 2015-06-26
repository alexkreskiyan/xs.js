/**
 * Abstract event class for events, being thrown when some touches are changed significantly - started, moved or finished
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.TouchChange
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.TouchChange', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.pointer.Pointer';

    Class.imports = {
        Touch: 'ns.pointer.Touch'
    };

    Class.abstract = true;

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

});