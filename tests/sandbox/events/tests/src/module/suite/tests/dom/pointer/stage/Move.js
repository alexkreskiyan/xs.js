xs.define(xs.Class, 'ns.tests.dom.pointer.stage.Move', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'Move over and out of button 3 times.';

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
        var blockEl = block.private.el;

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

        blockEl.addEventListener('mouseenter', simpleHandler);
        blockEl.addEventListener('mouseover', simpleHandler);
        blockEl.addEventListener('mousemove', simpleHandler);
        blockEl.addEventListener('mouseout', simpleHandler);
        blockEl.addEventListener('mouseleave', countdownHandler);
        blockEl.addEventListener('touchstart', simpleHandler);
        blockEl.addEventListener('touchmove', simpleHandler);
        blockEl.addEventListener('touchend', countdownHandler);
        blockEl.addEventListener('touchcancel', simpleHandler);

        me.private.cleanUp = function () {
            blockEl.removeEventListener('mouseenter', simpleHandler);
            blockEl.removeEventListener('mouseover', simpleHandler);
            blockEl.removeEventListener('mousemove', simpleHandler);
            blockEl.removeEventListener('mouseout', simpleHandler);
            blockEl.removeEventListener('mouseleave', countdownHandler);
            blockEl.removeEventListener('touchstart', simpleHandler);
            blockEl.removeEventListener('touchmove', simpleHandler);
            blockEl.removeEventListener('touchend', countdownHandler);
            blockEl.removeEventListener('touchcancel', simpleHandler);
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