xs.define(xs.Class, 'ns.tests.dom.tap.stage.Click', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.extends = 'ns.module.test.Stage';

    Class.constant.instruction = 'tap on button and somewhere out for 5 times';

    Class.method.start = function () {
        var me = this;

        if (self.parent.prototype.start.call(me)) {

            return;
        }

        var count = 10;

        var sandbox = me.private.container.query('.sandbox');

        var button = new xs.view.Element(document.createElement('button'));
        button.private.el.innerHTML = 'click me!';
        button.classes.add('single');
        me.private.container.sandbox.add(button);

        var countdownHandler = function (event) {
            //return if stage is done
            if (me.isDone) {

                return;
            }

            //decrease count on click
            count--;

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

        sandbox.private.el.addEventListener('click', countdownHandler);
        sandbox.private.el.addEventListener('mousedown', simpleHandler);
        sandbox.private.el.addEventListener('mouseup', simpleHandler);
        sandbox.private.el.addEventListener('touchstart', simpleHandler);
        sandbox.private.el.addEventListener('touchend', simpleHandler);
        sandbox.private.el.addEventListener('touchcancel', simpleHandler);

        button.private.el.addEventListener('click', countdownHandler);
        button.private.el.addEventListener('mousedown', simpleHandler);
        button.private.el.addEventListener('mouseup', simpleHandler);
        button.private.el.addEventListener('touchstart', simpleHandler);
        button.private.el.addEventListener('touchend', simpleHandler);
        button.private.el.addEventListener('touchcancel', simpleHandler);

        me.private.cleanUp = function () {
            sandbox.private.el.removeEventHandler('click', countdownHandler);
            sandbox.private.el.removeEventHandler('mousedown', simpleHandler);
            sandbox.private.el.removeEventHandler('mouseup', simpleHandler);
            sandbox.private.el.removeEventHandler('touchstart', simpleHandler);
            sandbox.private.el.removeEventHandler('touchend', simpleHandler);
            sandbox.private.el.removeEventHandler('touchcancel', simpleHandler);

            button.private.el.removeEventHandler('click', countdownHandler);
            button.private.el.removeEventHandler('mousedown', simpleHandler);
            button.private.el.removeEventHandler('mouseup', simpleHandler);
            button.private.el.removeEventHandler('touchstart', simpleHandler);
            button.private.el.removeEventHandler('touchend', simpleHandler);
            button.private.el.removeEventHandler('touchcancel', simpleHandler);
        };
    };

    Class.method.stop = function () {
        var me = this;

        self.parent.prototype.stop.call(me);

        if (me.private.cleanUp) {
            me.private.cleanUp();
        }

        me.private.container.query('.sandbox').off(imports.event.Tap);
    };

});