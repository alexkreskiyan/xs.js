xs.define(xs.Class, 'ns.event.NewTest', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        Test: 'ns.module.test.Module'
    };

    Class.implements = [
        'xs.event.IEvent'
    ];

    Class.constructor = function (test) {
        var me = this;

        self.assert.ok(test instanceof imports.Test, 'given test `$test` is not an instance of `$Test`', {
            $test: test,
            $Test: imports.Test
        });

        me.private.test = test;
    };

    Class.property.test = {
        set: xs.noop
    };

});