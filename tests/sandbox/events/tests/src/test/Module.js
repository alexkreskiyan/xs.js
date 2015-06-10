xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.test';

    Class.imports = {
        view: {
            Container: 'ns.view.Container'
        }
    };

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function () {
        var me = this;

        self.mixins.observable.call(me, xs.noop);

        //create container
        var container = me.container = new imports.view.Grid();
        container.attributes.set('id', 'grid');
    };

});