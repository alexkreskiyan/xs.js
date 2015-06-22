xs.define(xs.Class, 'ns.tests.dom.interaction.stage.Composition', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'Try to edit some text in textarea using composition (5 words)';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 15;

        var textarea = new xs.view.Element(document.createElement('textarea'));
        textarea.private.el.innerHTML = 'Try to enter some text here using composition';
        textarea.classes.add('single');
        textarea.private.el.style.width = '50%';
        textarea.private.el.style.height = '50%';
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

        textareaEl.addEventListener('compositionstart', countdownHandler);
        textareaEl.addEventListener('compositionupdate', countdownHandler);
        textareaEl.addEventListener('compositionend', countdownHandler);

        me.private.cleanUp = function () {

            textareaEl.removeEventListener('compositionstart', countdownHandler);
            textareaEl.removeEventListener('compositionupdate', countdownHandler);
            textareaEl.removeEventListener('compositionend', countdownHandler);
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