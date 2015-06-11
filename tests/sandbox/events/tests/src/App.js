xs.define(xs.Class, 'ns.App', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests';

    Class.imports = {
        view: {
            Container: 'ns.view.Container'
        },
        reader: {
            JSON: 'xs.data.reader.JSON'
        },
        suite: {
            Module: 'ns.module.suite.Module'
        }
    };

    Class.method.run = function () {
        var me = this;

        //make body a viewport
        var viewport = me.private.viewport = new imports.view.Container(document.body);


        //create suite module
        var suite = new imports.suite.Module();
        viewport.items.add(suite.container);
    };

});