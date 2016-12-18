xs.define(xs.Class, 'ns.event.StageChange', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    Class.imports = {
        Stage: 'ns.Stage'
    };

    Class.implements = [
        'xs.event.IEvent'
    ];

    Class.constructor = function (data) {
        var me = this;

        //assert, that data is an object
        self.assert.object(data, 'constructor - given `$data` is not an object', {
            $data: data
        });

        //assert, that data.stage is an instance of imports.Stage
        self.assert.ok(data.stage instanceof imports.Stage, 'constructor - given data.stage `$stage` is not an instance of `$Stage`', {
            $stage: data.stage,
            $Stage: imports.Stage
        });

        //assert, that data.index is a non-negative integer
        self.assert.ok(data.index >= 0 && Math.round(data.index) === data.index, 'constructor - given data.index `$index` is not a positive integer', {
            $index: data.index
        });

        //assert, that data.total is a non-negative integer
        self.assert.ok(data.total >= 0 && Math.round(data.total) === data.total, 'constructor - given data.total `$total` is not a positive integer', {
            $total: data.total
        });

        //save data to private
        me.private.stage = data.stage;
        me.private.index = data.index;
        me.private.total = data.total;
    };

    Class.property.stage = {
        set: xs.noop
    };

    Class.property.index = {
        set: xs.noop
    };

    Class.property.total = {
        set: xs.noop
    };

});