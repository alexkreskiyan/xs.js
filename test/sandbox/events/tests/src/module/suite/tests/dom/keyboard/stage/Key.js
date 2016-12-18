xs.define(xs.Class, 'ns.tests.dom.keyboard.stage.Key', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'Press different keys with alt, ctrl, shift, meta (5 times).';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 5;

        var textarea = new xs.view.Element(document.createElement('textarea'));
        textarea.private.el.innerHTML = 'Edit text here';
        textarea.classes.add('single');
        me.private.container.sandbox.add(textarea);
        var textareaEl = textarea.private.el;

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

        textareaEl.addEventListener('keypress', countdownHandler);
        textareaEl.addEventListener('keyup', simpleHandler);
        textareaEl.addEventListener('keydown', simpleHandler);

        me.private.cleanUp = function () {
            textareaEl.removeEventListener('keypress', countdownHandler);
            textareaEl.removeEventListener('keyup', simpleHandler);
            textareaEl.removeEventListener('keydown', simpleHandler);
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