xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.imports = [
        //{
        //    'view.event.Select': 'ns.view.event.Select'
        //},
        {
            'view.Grid': 'ns.view.Grid'
        },
        {
            'view.Header': 'ns.view.header.Row'
            //},
            //{
            //    'view.Field': 'ns.view.Field'
            //},
            //{
            //    'view.Option': 'ns.view.Option'
            //},
            //{
            //    Query: 'xs.data.Query'
            //},
            //{
            //    'event.Select': 'ns.event.Select'
        }
    ];

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function (controls) {
        var me = this;

        self.assert.object(controls, 'constructor - given controls `$controls` are not an object', {
            $controls: controls
        });

        self.mixins.observable.call(me, xs.noop);

        me.controls = controls;

        //create grid
        var grid = me.grid = new imports.view.Grid();
        me.grid.attributes.set('id', 'grid');

        //add header to grid
        var fields = new xs.core.Collection();
        me.controls.each(function (config) {
            (new xs.core.Collection(config.fields)).each(function (field) {
                if (!field.hasOwnProperty('show') || field.show) {
                    fields.add(field);
                }
            });
        });
        grid.header.add(new imports.view.Header(fields));
    };

    Class.method.load = function () {
        console.log('load');
    };

});