xs.define(xs.Class, 'ns.event.Log', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    Class.imports = {
        IEvent: 'xs.event.IEvent'
    };

    Class.implements = [
        'xs.event.IEvent'
    ];

    Class.constructor = function (event) {
        var me = this;

        self.assert.implements(event, imports.IEvent, 'constructor - given event `$event` does not implement `$IEvent` common interface', {
            $event: event,
            $IEvent: imports.IEvent
        });

        me.private.event = event;
    };

    Class.property.event = {
        set: xs.noop
    };

});