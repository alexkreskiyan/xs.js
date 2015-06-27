xs.define(xs.Class, 'ns.tests.xs.element.stage.Scroll', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        event: {
            Scroll: 'xs.view.event.element.Scroll'
        }
    };

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'scroll sandbox 10 times.';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 10;

        var sandbox = me.private.container.query('.sandbox');

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
            me.report(event.self.label, event);

            //if count is zero - mark stage as done
            if (!count) {

                me.done();
            }
        };

        sandbox.on(imports.event.Scroll, countdownHandler);
    };

    Class.method.stop = function () {
        var me = this;

        me.private.container.query('.sandbox').off(imports.event.Scroll);

        self.parent.prototype.stop.call(me);
    };

});