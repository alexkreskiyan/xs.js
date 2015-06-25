xs.define(xs.Class, 'ns.tests.xs.pointer.stage.TapEnd', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        event: {
            TapEnd: 'xs.view.event.pointer.TapEnd'
        }
    };

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'end tap anywhere in sandbox 10 times in different places';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 10;

        var sandbox = me.private.container.query('.sandbox');

        var countdownHandler = function (event) {
            //return if stage is done
            if (me.isDone) {

                return;
            }

            //decrease count on click
            count--;

            me.upgradeInstruction(self.instruction + ' ' + count + ' left.');

            //report event
            me.report(event.self.label, event);

            //if count is zero - mark stage as done
            if (!count) {

                me.done();
            }
        };

        sandbox.on(imports.event.TapEnd, countdownHandler);

        me.private.cleanUp = function () {
            sandbox.off(imports.event.TapEnd);
        };
    };

    Class.method.stop = function () {
        var me = this;

        self.parent.prototype.stop.call(me);

        me.private.container.query('.sandbox').off(imports.event.TapEnd);
    };

});