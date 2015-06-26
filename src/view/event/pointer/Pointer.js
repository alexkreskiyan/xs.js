/**
 * Abstract event class for events, being thrown when pointer taps
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Pointer
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.Pointer', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.extends = 'ns.Event';

    Class.imports = {
        Button: 'ns.pointer.Button'
    };

    Class.implements = [
        'ns.pointer.IEvent'
    ];

    Class.abstract = true;

    Class.constant.pointerEvents = (function () {
        var pointerEvents = {};
        var events = [
            'pointerDown',
            'pointerUp',
            'pointerOver',
            'pointerOut',
            'pointerEnter',
            'pointerLeave',
            'pointerMove'
        ];
        var isMSPointerEvent = 'MSPointerEvent' in window;
        var isPointerEvent = 'PointerEvent' in window;

        for (var i = 0; i < events.length; i++) {
            var event = events[ i ];

            if (isPointerEvent) {
                pointerEvents[ event ] = event.toLowerCase();
            } else if (isMSPointerEvent) {
                pointerEvents[ event ] = 'ms' + event.toLowerCase();
            } else {
                pointerEvents[ event ] = 'mouse' + event.slice(7).toLowerCase();
            }
        }

        return pointerEvents;
    })();

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

        //screenX
        self.assert.number(data.screenX, 'constructor - given data.screenX `$screenX` is not a number', {
            $screenX: data.screenX
        });
        me.private.screenX = data.screenX;

        //screenY
        self.assert.number(data.screenY, 'constructor - given data.screenY `$screenY` is not a number', {
            $screenY: data.screenY
        });
        me.private.screenY = data.screenY;

        //clientX
        self.assert.number(data.clientX, 'constructor - given data.clientX `$clientX` is not a number', {
            $clientX: data.clientX
        });
        me.private.clientX = data.clientX;

        //clientY
        self.assert.number(data.clientY, 'constructor - given data.clientY `$clientY` is not a number', {
            $clientY: data.clientY
        });
        me.private.clientY = data.clientY;

        //button
        self.assert.ok(imports.Button.has(data.button), 'constructor - given data.button `$button` is not button identifier', {
            $button: data.button
        });
        me.private.button = data.button;

        //ctrlKey
        self.assert.boolean(data.ctrlKey, 'constructor - given data.ctrlKey `$ctrlKey` is not a boolean', {
            $ctrlKey: data.ctrlKey
        });
        me.private.ctrlKey = data.ctrlKey;

        //altKey
        self.assert.boolean(data.altKey, 'constructor - given data.altKey `$altKey` is not a boolean', {
            $altKey: data.altKey
        });
        me.private.altKey = data.altKey;

        //shiftKey
        self.assert.boolean(data.shiftKey, 'constructor - given data.shiftKey `$shiftKey` is not a boolean', {
            $shiftKey: data.shiftKey
        });
        me.private.shiftKey = data.shiftKey;

        //metaKey
        self.assert.boolean(data.metaKey, 'constructor - given data.metaKey `$metaKey` is not a boolean', {
            $metaKey: data.metaKey
        });
        me.private.metaKey = data.metaKey;
    };

    Class.property.screenX = {
        set: xs.noop
    };

    Class.property.screenY = {
        set: xs.noop
    };

    Class.property.clientX = {
        set: xs.noop
    };

    Class.property.clientY = {
        set: xs.noop
    };

    Class.property.button = {
        set: xs.noop
    };

    Class.property.ctrlKey = {
        set: xs.noop
    };

    Class.property.altKey = {
        set: xs.noop
    };

    Class.property.shiftKey = {
        set: xs.noop
    };

    Class.property.metaKey = {
        set: xs.noop
    };

});