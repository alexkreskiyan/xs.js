xs.define(xs.Class, 'ns.App', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests';

    Class.imports = {
        view: {
            Viewport: 'ns.view.Viewport'
        },
        data: {
            model: {
                Entry: 'ns.data.model.Entry'
            },
            proxy: {
                Xhr: 'ns.data.proxy.Xhr'
            },
            source: {
                Log: 'ns.data.source.Log'
            }
        },
        reader: {
            JSON: 'xs.data.reader.JSON'
        },
        suite: {
            Module: 'ns.suite.Module'
        }
    };

    Class.method.run = function () {
        var me = this;

        //make body a viewport
        var viewport = me.private.viewport = new imports.view.Viewport(document.body);


        //create suite module
        var suite = new imports.suite.Module();
        viewport.items.add(suite.container);
    };

});