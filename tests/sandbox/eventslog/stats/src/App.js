xs.define(xs.Class, 'ns.App', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats';

    Class.imports = [
        {
            Viewport: 'ns.Viewport'
        },
        {
            Controls: 'ns.controls.Module'
        }
    ];

    Class.method.run = function () {
        var me = this;

        //make body a viewport
        var viewport = me.private.viewport = new imports.Viewport(document.body);

        //create controls module
        var controls = new imports.Controls();
        viewport.items.add(controls.container);
    };

    Class.property.viewport = {
        set: xs.noop
    };

});