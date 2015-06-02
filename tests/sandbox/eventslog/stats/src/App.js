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
        },
        {
            'event.Select': 'ns.controls.event.Select'
        }
    ];

    Class.method.run = function () {
        var me = this;

        //make body a viewport
        var viewport = me.private.viewport = new imports.Viewport(document.body);

        //create controls module
        var controls = me.controls = new imports.Controls();
        viewport.items.add(controls.container);

        me.controls.on(imports.event.Select, function (event) {
            console.log(event.field, event.value.toSource());
        });
    };

});