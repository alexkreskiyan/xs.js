xs.define(xs.Class, 'ns.event.Log', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    Class.implements = [
        'xs.event.IEvent'
    ];

    Class.constructor = function (name, event) {
        var me = this;

        self.assert.string(name, 'constructor - given name `$name` is not a string', {
            $name: name
        });

        me.private.name = name;
        me.private.event = event;
    };

    Class.property.name = {
        set: xs.noop
    };

    Class.property.event = {
        set: xs.noop
    };

});