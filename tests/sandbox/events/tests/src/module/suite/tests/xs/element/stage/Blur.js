xs.define(xs.Class, 'ns.tests.xs.element.stage.Blur', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        event: {
            Blur: 'xs.view.event.element.Blur'
        }
    };

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'make input lose focus 2 times';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 2;

        var input = new xs.view.Element(document.createElement('input'));
        input.private.el.type = 'text';
        input.private.el.value = 'edit here';
        input.classes.add('single');
        me.private.container.sandbox.add(input);

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

        input.on(imports.event.Blur, countdownHandler);
    };

    Class.method.stop = function () {
        var me = this;

        me.private.container.sandbox.at(0).off(imports.event.Blur);

        self.parent.prototype.stop.call(me);
    };

});