xs.define(xs.Class, 'ns.tests.xs.context.stage.VisibilityChange', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        Context: 'xs.view.Context',
        event: {
            VisibilityChange: 'xs.view.event.context.VisibilityChange'
        }
    };

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'change context visibility 10 times';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 10;

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

        imports.Context.on(imports.event.VisibilityChange, countdownHandler);

        me.private.cleanUp = function () {
            imports.Context.off(imports.event.VisibilityChange);
        };
    };

    Class.method.stop = function () {
        var me = this;

        self.parent.prototype.stop.call(me);

        imports.Context.off(imports.event.VisibilityChange);
    };

});