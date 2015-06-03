xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.imports = [
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
        },
        {
            Query: 'xs.data.Query'
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
        me.attributes = me.fields.map(function (field) {

            return field.field;
        }).values();


        //create grid
        var grid = me.grid = new imports.view.Grid();
        me.grid.attributes.set('id', 'grid');

        //add header to grid
        var header = new imports.view.Header(me.fields);
        grid.header.add(header);

        header.on(imports.event.view.Sort, xs.bind(sort, me));

        //define processors collection
        me.processors = new xs.core.Collection();
    };

    Class.method.load = function () {
        var me = this;
        load.call(me, me.source);
    };

    Class.method.filter = function (field, value) {
        var me = this;
        var processor = me.processors.find(function (processor) {

            return processor.type === 'filter' && processor.field === field;
        });

        if (value.size && processor) {
            processor.value = value;
        } else if (value.size) {
            me.processors.add({
                type: 'filter',
                field: field,
                value: value
            });
        } else if (processor) {
            me.processors.remove(processor);
        }

        update.call(me);
    };

    var sort = function (event) {
        var me = this;
        var processor = me.processors.find(function (processor) {

            return processor.type === 'sort' && processor.field === event.field;
        });

        if (event.direction && processor) {
            processor.direction = event.direction;
        } else if (event.direction) {
            me.processors.add({
                type: 'sort',
                field: event.field,
                direction: event.direction
            });
        } else if (processor) {
            me.processors.remove(processor);
        }

        update.call(me);
    };

    var update = function () {
        var me = this;
        console.log('update grid');

        //separate filters and sorters
        var filters = me.processors.find(function (processor) {
            return processor.type === 'filter';
        }, xs.core.Collection.All);
        var sorters = me.processors.find(function (processor) {
            return processor.type === 'sort';
        }, xs.core.Collection.All);

        //build query
        var query = new imports.Query(me.source);
        filters.each(function (filter) {
            query.where(function (model) {

                return filter.value.has(model[ filter.field ].get());
            });
        });
        sorters.each(function (sorter) {
            if (sorter.direction === 'ASC') {
                query.sort(function (a, b) {

                    return a[ sorter.field ] < b[ sorter.field ];
                });
            } else {
                query.sort(function (a, b) {

                    return a[ sorter.field ] > b[ sorter.field ];
                });
            }
        });

        //execute query
        query.execute();

        //refresh grid
        load.call(me, query);
    };

    var load = function (source) {
        var me = this;

        me.grid.rows.remove();

        source.each(function (model) {
            me.grid.rows.add(new imports.view.Row(model.get(me.attributes), me.attributes));
        });

    };

});