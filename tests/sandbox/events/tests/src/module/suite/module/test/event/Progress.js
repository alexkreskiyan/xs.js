xs.define(xs.Class, 'ns.event.Progress', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    Class.implements = [
        'xs.event.IEvent'
    ];

    Class.constructor = function (data) {
        var me = this;

        //assert, that data is an object
        self.assert.object(data, 'constructor - given `$data` is not an object', {
            $data: data
        });

        //save data to private
        me.private.data = data;
    };

    Class.property.data = {
        set: xs.noop
    };

});