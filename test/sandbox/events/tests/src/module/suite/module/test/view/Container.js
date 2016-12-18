xs.define(xs.Class, 'ns.view.Container', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    Class.imports = {
        Template: 'xs.resource.text.HTML'
    };

    Class.extends = 'xs.view.View';

    Class.positions = [
        'instructions',
        'controls',
        'sandbox'
    ];

    Class.resources = {
        template: xs.lazy(function () {
            return new imports.Template({
                url: 'src/module/suite/module/test/resources/template/Container.html'
            });
        })
    };

    Class.constant.template = xs.lazy(function () {
        return self.resources.template;
    });

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