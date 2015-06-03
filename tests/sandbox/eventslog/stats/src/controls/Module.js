xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.controls';

    Class.imports = [
        {
            'view.event.Select': 'ns.view.event.Select'
        },
        {
            'view.Container': 'ns.view.Container'
        },
        {
            'view.Group': 'ns.view.Group'
        },
        {
            'view.Field': 'ns.view.Field'
        },
        {
            'view.Option': 'ns.view.Option'
        },
        {
            Query: 'xs.data.Query'
        },
        {
            'event.Select': 'ns.event.Select'
        }
    ];

    Class.mixins.observable = 'xs.event.Observable';

    Class.constructor = function (controls) {
        var me = this;

        self.assert.object(controls, 'constructor - given controls `$controls` are not an object', {
            $controls: controls
        });

        self.mixins.observable.call(me, xs.noop);

        me.container = new imports.view.Container();
        me.container.attributes.set('id', 'controls');

        me.controls = controls;

        createControls.call(me);
    };

    Class.method.fillControls = function (source) {
        var me = this;

        me.container.items.each(function (group, name) {
            var groupConfig = me.controls.at(name);

            group.items.each(function (field, name) {
                var config = groupConfig.fields[ name ];

                var query = new imports.Query(source);
                query
                    .select(function (item) {

                        return {
                            value: item[ config.field ].get()
                        };
                    })
                    .group(function (item) {

                        return item.value;
                    })
                    .select(function (item) {
                        return item.key;
                    });
                query.execute();

                field.items.remove();

                query.each(function (value) {
                    field.items.add(new imports.view.Option({
                        value: value,
                        label: value
                    }));
                });
            });
        });
    };

    function createControls() {
        var me = this;

        me.controls.each(function (config, name) {
            if (config.hasOwnProperty('show') && !config.show) {

                return;
            }

            var group = new imports.view.Group({
                name: name,
                label: config.label
            });
            me.container.items.add(name, group);
            (new xs.core.Collection(config.fields)).each(function (config, name) {
                if (config.hasOwnProperty('show') && !config.show) {

                    return;
                }

                var field = new imports.view.Field({
                    name: name,
                    field: config.field,
                    label: config.label
                });
                field.on(imports.view.event.Select, function (event) {
                    me.events.send(new imports.event.Select({
                        field: field.field,
                        value: event.value
                    }));
                }, {
                    scope: field
                });
                group.items.add(name, field);
            });
        });
    }

});