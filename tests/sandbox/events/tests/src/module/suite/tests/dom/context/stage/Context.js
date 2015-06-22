xs.define(xs.Class, 'ns.tests.dom.context.stage.Context', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'Toggle active window, resize window (5 times).';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 5;

        var countdownHandler = function (event) {
            //return if stage is done
            if (me.isDone) {

                return;
            }

            //decrease count on click
            count--;

            me.upgradeInstruction(self.instruction + ' ' + count + ' left.');

            //report event
            me.report(event.type, event);

            //if count is zero - mark stage as done
            if (!count) {

                me.done();
            }
        };

        document.addEventListener('visibilitychange', countdownHandler);
        window.addEventListener('resize', countdownHandler);

        me.private.cleanUp = function () {
            document.removeEventListener('visibilitychange', countdownHandler);
            window.removeEventListener('resize', countdownHandler);
        };
    };

    Class.method.stop = function () {
        var me = this;

        self.parent.prototype.stop.call(me);

        if (me.private.cleanUp) {
            me.private.cleanUp();
        }
    };

});