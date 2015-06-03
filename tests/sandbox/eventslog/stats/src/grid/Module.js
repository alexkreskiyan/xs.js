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
        },
        {
            'view.Row': 'ns.view.Row'
        },
        {
            'event.view.Sort': 'ns.view.event.Sort'
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

    Class.constructor = function (controls, source) {
        var me = this;

        self.assert.object(controls, 'constructor - given controls `$controls` are not an object', {
            $controls: controls
        });

        self.mixins.observable.call(me, xs.noop);

        me.controls = controls;
        me.source = source;


        //collect fields
        me.fields = new xs.core.Collection();
        me.controls.each(function (config) {
            (new xs.core.Collection(config.fields)).each(function (field) {
                if (!field.hasOwnProperty('show') || field.show) {
                    me.fields.add(field);
                }
            });
        });


        //create grid
        var grid = me.grid = new imports.view.Grid();
        me.grid.attributes.set('id', 'grid');

        //add header to grid
        var header = new imports.view.Header(me.fields);
        grid.header.add(header);

        header.on(imports.event.view.Sort, xs.bind(sort, me));
    };

    Class.method.load = function () {
        var me = this;
        me.grid.rows.remove();

        var fields = me.fields.map(function (field) {

            return field.field;
        }).values();

        me.source.each(function (model) {
            me.grid.rows.add(new imports.view.Row(model.get(fields)));
        });
    };

    var sort = function (event) {
        var me = this;
        console.log(me.self, event.field, event.direction);
    };

});