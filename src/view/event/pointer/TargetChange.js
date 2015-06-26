/**
 * Abstract event class for events, being thrown when pointer changes it's target
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.TargetChange
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.TargetChange', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.pointer.Pointer';

    Class.imports = {
        Element: 'xs.view.Element'
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


        //validate and save event fields

        //relatedTarget
        self.assert.ok(event.relatedTarget instanceof Element, 'constructor - given event.relatedTarget `$relatedTarget` is not a `$Element` instance', {
            $relatedTarget: event.relatedTarget,
            $Element: Element
        });
        me.private.relatedTarget = event.relatedTarget;
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

});