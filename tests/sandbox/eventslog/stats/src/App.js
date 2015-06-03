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
            'grid.event.Select': 'ns.grid.event.Select'
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
            console.log(event.field, event.value.toSource());
        });


        //create grid module
        me.grid = new imports.Grid(controls);
        viewport.items.add(me.grid.grid);


        me.source = new imports.data.source.Log();
        me.source.proxy = new imports.data.proxy.Xhr();
        me.source.proxy.reader = new imports.reader.JSON();

        me.source.readAll().then(function () {
            me.controls.fillControls(me.source);
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