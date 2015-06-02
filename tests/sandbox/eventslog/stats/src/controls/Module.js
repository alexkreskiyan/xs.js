xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.controls';

    Class.imports = [
        {
            'data.model.Entry': 'ns.data.model.Entry'
        },
        {
            'data.proxy.Xhr': 'ns.data.proxy.Xhr'
        },
        {
            'data.store.Log': 'ns.data.store.Log'
        },
        {
            'reader.JSON': 'xs.data.reader.JSON'
        },
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

    Class.constructor = function () {
        var me = this;

        self.mixins.observable.call(me, xs.noop);

        me.container = new imports.view.Container();
        me.container.attributes.set('id', 'controls');

        createControls.call(me, controls);

        var source = me.source = new imports.data.store.Log();
        source.proxy = new imports.data.proxy.Xhr();
        source.proxy.reader = new imports.reader.JSON();

        source.readAll().then(function () {
            fillControls.call(me, controls);
        }, function (error) {
            throw error;
        });
    };

    function createControls(controls) {
        var me = this;

        (new xs.core.Collection(controls)).each(function (config, name) {
            var group = new imports.view.Group({
                name: name,
                label: config.label
            });
            me.container.items.add(name, group);
            (new xs.core.Collection(config.fields)).each(function (config, name) {
                var field = new imports.view.Field({
                    name: name,
                    label: config.label
                });
                field.on(imports.view.event.Select, function (event) {
                    me.events.send(new imports.event.Select({
                        field: field.name,
                        value: event.value
                    }));
                }, {
                    scope: field
                });
                group.items.add(name, field);
            });
        });
    }

    function fillControls(controls) {
        var me = this;

        me.container.items.each(function (group, name) {
            var groupConfig = controls[ name ];

            group.items.each(function (field, name) {
                var config = groupConfig.fields[ name ];

                var query = new imports.Query(me.source);
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

                query.each(function (value) {
                    field.items.add(new imports.view.Option({
                        value: value,
                        label: value
                    }));
                });
            });
        });
    }

    var controls = {
        common: {
            label: 'Общие настройки',
            fields: {
                user: {
                    label: 'Пользователь',
                    field: 'user'
                },
                device: {
                    label: 'Устройство',
                    field: 'device'
                },
                category: {
                    label: 'Категория',
                    field: 'category'
                },
                name: {
                    label: 'Название',
                    field: 'name'
                }
            }
        },
        browser: {
            label: 'Браузер',
            fields: {
                name: {
                    label: 'Название',
                    field: 'browserName'
                },
                version: {
                    label: 'Версия',
                    field: 'browserVersion'
                },
                major: {
                    label: 'Мажорная версия',
                    field: 'browserMajor'
                },
                minor: {
                    label: 'Минорная версия',
                    field: 'browserMinor'
                }
            }
        },
        engine: {
            label: 'Движок JS',
            fields: {
                name: {
                    label: 'Название',
                    field: 'engineName'
                },
                version: {
                    label: 'Версия',
                    field: 'engineVersion'
                },
                major: {
                    label: 'Мажорная версия',
                    field: 'engineMajor'
                },
                minor: {
                    label: 'Минорная версия',
                    field: 'engineMinor'
                }
            }
        },
        environment: {
            label: 'Окружение',
            fields: {
                architecture: {
                    label: 'Архитектура',
                    field: 'cpu'
                },
                os: {
                    label: 'Устройство',
                    field: 'osName'
                },
                version: {
                    label: 'Категория',
                    field: 'osVersion'
                }
            }
        }
    };

});