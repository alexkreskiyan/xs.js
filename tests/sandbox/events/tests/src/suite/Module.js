xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.suite';

    Class.imports = {
        view: {
            Container: 'tests.view.Container'
        }
    };

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function () {
        var me = this;

        self.mixins.observable.call(me, xs.noop);

        //create container
        var container = me.container = new imports.view.Container();
        container.attributes.set('id', 'suite');
    };

});