xs.define(xs.Class, 'ns.tests.dom.interaction.stage.Element', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'Toggle focus in input (4 times)';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 4;

        var input = new xs.view.Element(document.createElement('input'));
        input.type = 'text';
        input.value = 'edit here';
        input.classes.add('single');
        me.private.container.sandbox.add(input);
        var inputEl = input.private.el;

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

        inputEl.addEventListener('focus', countdownHandler);
        inputEl.addEventListener('blur', countdownHandler);

        me.private.cleanUp = function () {
            inputEl.removeEventListener('focus', countdownHandler);
            inputEl.removeEventListener('blur', countdownHandler);
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