xs.define(xs.Class, 'ns.tests.dom.pointer.stage.Tap', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'Tap for 3 times.';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 3;

        var sandbox = me.private.container.query('.sandbox');
        var sandboxEl = sandbox.private.el;

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

        var simpleHandler = function (event) {
            //return if stage is done
            if (me.isDone) {

                return;
            }

            //report event
            me.report(event.type, event);
        };

        sandboxEl.addEventListener('click', countdownHandler);
        sandboxEl.addEventListener('mousedown', simpleHandler);
        sandboxEl.addEventListener('mouseup', simpleHandler);
        sandboxEl.addEventListener('touchstart', simpleHandler);
        sandboxEl.addEventListener('touchend', simpleHandler);
        sandboxEl.addEventListener('touchcancel', simpleHandler);

        me.private.cleanUp = function () {
            sandboxEl.removeEventListener('click', countdownHandler);
            sandboxEl.removeEventListener('mousedown', simpleHandler);
            sandboxEl.removeEventListener('mouseup', simpleHandler);
            sandboxEl.removeEventListener('touchstart', simpleHandler);
            sandboxEl.removeEventListener('touchend', simpleHandler);
            sandboxEl.removeEventListener('touchcancel', simpleHandler);
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