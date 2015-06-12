xs.define(xs.Class, 'ns.App', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests';

    Class.imports = {
        reader: {
            JSON: 'xs.data.reader.JSON'
        },
        suite: {
            event: {
                NewTest: 'ns.module.suite.event.NewTest'
            },
            Module: 'ns.module.suite.Module'
        },
        view: {
            Container: 'ns.view.Container'
        }
    };

    Class.method.run = function () {
        var me = this;

        //make body a viewport
        var viewport = me.private.viewport = new imports.view.Container(document.body);


        //create suite module
        var suite = new imports.suite.Module();
        viewport.items.add(suite.container);

        suite.on(imports.suite.event.NewTest, function (event) {
            viewport.items.add(event.test.container);
        });
    };

});