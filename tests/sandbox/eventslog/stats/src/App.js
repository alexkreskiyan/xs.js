xs.define(xs.Class, 'ns.App', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats';

    Class.imports = [
        {
            Viewport: 'ns.Viewport'
        },
        {
            'data.model.Entry': 'ns.data.model.Entry'
        },
        {
            'data.proxy.Xhr': 'ns.data.proxy.Xhr'
        },
        {
            'data.source.Log': 'ns.data.source.Log'
        },
        {
            'reader.JSON': 'xs.data.reader.JSON'
        },
        {
            Controls: 'ns.controls.Module'
        },
        {
            'controls.event.Select': 'ns.controls.event.Select'
        },
        {
            Grid: 'ns.grid.Module'
        },
        {
            'grid.event.Compare': 'ns.grid.event.Compare'
        },
        {
            Comparison: 'ns.comparison.Module'
        }
    ];

    Class.method.run = function () {
        var me = this;

        //make body a viewport
        var viewport = me.private.viewport = new imports.Viewport(document.body);


        //create controls module
        me.controls = new imports.Controls(controls);
        viewport.items.add(me.controls.container);

        me.controls.on(imports.controls.event.Select, function (event) {
            me.grid.filter(event.field, event.value);
        });

        //define source
        me.source = new imports.data.source.Log();
        me.source.proxy = new imports.data.proxy.Xhr();
        me.source.proxy.reader = new imports.reader.JSON();

        //create grid module
        me.grid = new imports.Grid(controls, me.source);
        viewport.items.add(me.grid.grid);

        me.grid.on(imports.grid.event.Compare, function (event) {
            me.comparison.compare(event.models);
        });

        //create comparison module
        me.comparison = new imports.Comparison(controls, me.source);
        viewport.items.add(me.comparison.container);

        //load data to source and update app state
        me.source.readAll().then(function () {
            me.controls.fillControls(me.source);
            xs.nextTick(function () {
                me.grid.load();
            });
        }, function (error) {
            throw error;
        });
    };

    var controls = new xs.core.Collection({
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
        },
        other: {
            show: false,
            fields: {
                time: {
                    label: 'Время',
                    field: 'time'
                },
                userAgent: {
                    label: 'userAgent',
                    show: false,
                    field: 'userAgent'
                },
                event: {
                    label: 'Событие',
                    show: false,
                    field: 'event'
                }
            }
        }
    });

});