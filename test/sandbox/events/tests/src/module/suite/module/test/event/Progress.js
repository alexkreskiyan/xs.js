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

        //assert, that data.done is a non-negative integer
        self.assert.ok(data.done >= 0 && Math.round(data.done) === data.done, 'constructor - given data.done `$done` is not a positive integer', {
            $done: data.done
        });

        //assert, that data.total is a non-negative integer
        self.assert.ok(data.total >= 0 && Math.round(data.total) === data.total, 'constructor - given data.total `$total` is not a positive integer', {
            $total: data.total
        });

        //save data to private
        me.private.done = data.done;
        me.private.total = data.total;
    };

    Class.property.done = {
        set: xs.noop
    };

    Class.property.total = {
        set: xs.noop
    };

});