xs.define(xs.Class, 'ns.tests.dom.tap.stage.Click', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'Tap on button and somewhere out for 10 times.';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 10;

        var sandbox = me.private.container.query('.sandbox');
        var sandboxEl = sandbox.private.el;

        var button = new xs.view.Element(document.createElement('button'));
        button.private.el.innerHTML = 'click me!';
        button.classes.add('single');
        me.private.container.sandbox.add(button);
        var buttonEl = button.private.el;

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

        buttonEl.addEventListener('click', countdownHandler);
        buttonEl.addEventListener('mousedown', simpleHandler);
        buttonEl.addEventListener('mouseup', simpleHandler);
        buttonEl.addEventListener('touchstart', simpleHandler);
        buttonEl.addEventListener('touchend', simpleHandler);
        buttonEl.addEventListener('touchcancel', simpleHandler);

        me.private.cleanUp = function () {
            sandboxEl.removeEventListener('click', countdownHandler);
            sandboxEl.removeEventListener('mousedown', simpleHandler);
            sandboxEl.removeEventListener('mouseup', simpleHandler);
            sandboxEl.removeEventListener('touchstart', simpleHandler);
            sandboxEl.removeEventListener('touchend', simpleHandler);
            sandboxEl.removeEventListener('touchcancel', simpleHandler);

            buttonEl.removeEventListener('click', countdownHandler);
            buttonEl.removeEventListener('mousedown', simpleHandler);
            buttonEl.removeEventListener('mouseup', simpleHandler);
            buttonEl.removeEventListener('touchstart', simpleHandler);
            buttonEl.removeEventListener('touchend', simpleHandler);
            buttonEl.removeEventListener('touchcancel', simpleHandler);
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