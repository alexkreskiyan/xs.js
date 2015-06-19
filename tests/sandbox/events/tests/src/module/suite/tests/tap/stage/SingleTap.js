xs.define(xs.Class, 'ns.tests.tap.stage.SingleTap', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        event: {
            Tap: 'xs.view.event.pointer.Tap'
        }
    };

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'tap anywhere in sandbox 5 times in different places';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 5;

        me.private.container.query('.sandbox').on(imports.event.Tap, function (event) {
            //decrease count on click
            count--;

            //report event
            me.report(event);

            //if count is positive - return
            if (count) {

                return;
            }

            me.done();

            xs.nextTick(function () {
                me.private.container.query('.sandbox').off(imports.event.Tap);
            });
        });
    };

    Class.method.stop = function () {
        var me = this;

        self.parent.prototype.stop.call(me);

        me.private.container.query('.sandbox').off(imports.event.Tap);
    };

});