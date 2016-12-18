xs.define(xs.Class, 'ns.view.Instruction', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    Class.extends = 'xs.view.Element';

    Class.constructor = function (text) {
        var me = this;

        self.assert.string(text, 'constructor - given `$text` is not a string', {
            $text: text
        });

        //call parent
        self.parent.call(me, document.createElement('div'));

        //add instruction class
        me.classes.add('instruction');

        //instruction is hidden and invisible by default
        me.classes.add('hidden');
        me.classes.add('invisible');

        //set text as innerHTML
        me.private.el.innerHTML = text;
    };

    Class.property.isVisible = {
        get: function () {
            var me = this;

            return !me.classes.has('hidden');
        },
        set: xs.noop
    };

    var fadeTimeout = 200;

    Class.method.show = function () {
        var me = this;

        //assert, that view is hidden
        self.assert.not(me.isVisible, 'show - view is already visible');

        var promise = new xs.core.Promise();

        //show
        me.classes.remove('hidden');
        xs.nextTick(function () {
            //fade in
            me.classes.remove('invisible');
        });

        setTimeout(function () {
            promise.resolve();
        }, fadeTimeout);

        return promise;
    };

    Class.method.hide = function () {
        var me = this;

        //assert, that view is visible
        self.assert.ok(me.isVisible, 'show - view is already hidden');

        var promise = new xs.core.Promise();

        //fade out
        me.classes.add('invisible');
        setTimeout(function () {
            //hide
            me.classes.add('hidden');

            promise.resolve();
        }, fadeTimeout);

        return promise;
    };

});