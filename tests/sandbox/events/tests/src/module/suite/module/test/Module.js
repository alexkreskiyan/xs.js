xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    Class.imports = {
        data: {
            model: {
                Test: 'tests.module.suite.data.model.Test'
            }
        },
        event: {
            Click: 'tests.module.suite.event.Click'
        },
        view: {
            Container: 'ns.view.Container',
            Control: 'ns.view.Control'
        }
    };

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function (test) {
        var me = this;

        //assert, that test is a imports.model.Test instance
        self.assert.ok(test instanceof imports.model.Test, 'constructor - given test `$test` is not a valid `$Test` instance', {
            $test: test,
            $Test: imports.model.Test
        });

        self.mixins.observable.call(me, xs.noop);

        //add container
        var container = me.private.container = new imports.view.Container();

        //add close control
        var close = new imports.view.Control({
            name: 'close',
            label: 'Закрыть'
        });
        container.controls.add(close);
        close.on(imports.event.Click, function () {
            me.hide();
        });

        me.private.model = test;
    };

    Class.property.container = {
        set: xs.noop
    };

    Class.property.model = {
        set: xs.noop
    };

    Class.method.show = function () {
        var me = this;

        return me.private.container.show();
    };

    Class.method.hide = function () {
        var me = this;

        return me.private.container.hide();
    };

});