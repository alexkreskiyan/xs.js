xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite.module.test';

    Class.imports = {
        event: {
            Click: 'tests.module.suite.event.Click'
        },
        view: {
            Container: 'ns.view.Container',
            Control: 'ns.view.Control'
        }
    };

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function (state) {
        var me = this;

        //assert, that state is an object
        self.assert.object(state, 'constructor - given state `$state` is not an object', {
            $state: state
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
    };

    Class.property.container = {
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