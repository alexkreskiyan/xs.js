xs.define(xs.Class, 'ns.tests.dom.interaction.stage.Scroll', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'Double tap on button and out for 10 times.';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 10;

        var sandbox = me.private.container.query('.sandbox');
        var sandboxEl = sandbox.private.el;

        var block = new xs.view.Element(document.createElement('div'));
        block.private.el.innerHTML = 'scroll me!';
        block.private.el.style.width = '2000px';
        block.private.el.style.height = '2000px';
        me.private.container.sandbox.add(block);

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

        sandboxEl.addEventListener('scroll', countdownHandler);

        me.private.cleanUp = function () {
            sandboxEl.removeEventListener('scroll', countdownHandler);
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