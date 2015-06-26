xs.define(xs.Class, 'ns.tests.xs.pointer.stage.Over', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        event: {
            Over: 'xs.view.event.pointer.Over'
        }
    };

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'move over red block for 3 times for different places';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 3;

        var block = new xs.view.Element(document.createElement('div'));
        block.private.el.innerHTML = '<div class="single" style="width: 70%; height: 70%; border: 2px solid blue;"></div>';
        block.classes.add('single');
        block.private.el.style.width = '50%';
        block.private.el.style.height = '50%';
        block.private.el.style.border = '2px solid red';
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

        block.on(imports.event.Over, countdownHandler);

        me.private.cleanUp = function () {
            block.off(imports.event.Over);
        };
    };

    Class.method.stop = function () {
        var me = this;

        me.private.container.sandbox.at(0).off(imports.event.Over);

        self.parent.prototype.stop.call(me);
    };

});