xs.define(xs.Class, 'ns.tests.tap.stage.DoubleTap', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'tap anywhere in sandbox twice';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        setTimeout(function () {
            me.done();
        }, 1000);
    };

    Class.method.stop = function () {
        var me = this;

        self.parent.prototype.stop.call(me);
    };

});