xs.define(xs.Class, 'ns.tests.xs.content.stage.Input', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        event: {
            Input: 'xs.view.event.content.Input'
        }
    };

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'input some test in textarea 5 times';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 5;

        var textarea = new xs.view.Element(document.createElement('textarea'));
        textarea.private.el.innerHTML = 'Edit text here...';
        textarea.classes.add('single');
        textarea.private.el.style.width = '50%';
        textarea.private.el.style.height = '50%';
        me.private.container.sandbox.add(textarea);

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

        textarea.on(imports.event.Input, countdownHandler);
    };

    Class.method.stop = function () {
        var me = this;

        me.private.container.sandbox.at(0).off(imports.event.Input);

        self.parent.prototype.stop.call(me);
    };

});