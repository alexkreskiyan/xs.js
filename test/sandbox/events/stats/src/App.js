xs.define(xs.Class, 'ns.App', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats';

    Class.imports = {
        comparison: {
            Module: 'ns.comparison.Module'
        },
        controls: {
            event: {
                Select: 'ns.controls.event.Select'
            },
            Module: 'ns.controls.Module'
        },
        data: {
            model: {
                Entry: 'ns.data.model.Entry'
            },
            proxy: {
                Xhr: 'ns.data.proxy.Xhr'
            },
            reader: {
                JSON: 'xs.data.reader.JSON'
            },
            source: {
                Log: 'ns.data.source.Log'
            }
        },
        grid: {
            event: {
                Compare: 'ns.grid.event.Compare',
                Show: 'ns.grid.event.Show'
            },
            Module: 'ns.grid.Module'
        },
        view: {
            Viewport: 'ns.Viewport'
        },
        uri: {
            HTTP: 'xs.uri.HTTP',
            QueryString: 'xs.uri.query.QueryString'
        }
    };

    Class.method.run = function () {
        var me = this;

        //make body a viewport
        var viewport = me.private.viewport = new imports.view.Viewport(document.body);


        //create controls module
        me.controls = new imports.controls.Module(controls);
        viewport.items.add(me.controls.container);

        me.controls.on(imports.controls.event.Select, function (event) {
            me.grid.filter(event.field, event.value);
        });

        //get location url to evaluate used test suite
        var suite = (new imports.uri.HTTP(location.href, imports.uri.QueryString)).query.params.suite;

        var databases = {
            dom: 'domEventsTests',
            xs: 'xsEventsTests'
        };

        //validate suite name
        self.assert.ok(databases.hasOwnProperty(suite), 'unknown suite name `$suite`', {
            $suite: suite
        });

        //define source
        me.source = new imports.data.source.Log();
        me.source.proxy = new imports.data.proxy.Xhr(databases[ suite ]);
        me.source.proxy.reader = new imports.data.reader.JSON();

        //create grid module
        me.grid = new imports.grid.Module(controls, me.source);
        viewport.items.add(me.grid.grid);

        me.grid.on(imports.grid.event.Compare, function (event) {
            me.comparison.compare(event.models);
        });

        me.grid.on(imports.grid.event.Show, function (event) {
            me.comparison.compare(
                (new xs.data.Query(me.source))
                    .where(function (model) {

                        return model.user.get() === event.model.user.get() &&
                            model.device.get() === event.model.device.get() &&
                            model.test.get() === event.model.test.get() &&
                            model.stage.get() === event.model.stage.get() &&
                            model.name.get() === event.model.name.get() &&
                            model.userAgent.get() === event.model.userAgent.get();
                    })
                    .execute()
            );
        });

        //create comparison module
        me.comparison = new imports.comparison.Module(controls);
        viewport.items.add(me.comparison.container);

        //load data to source and update app state
        me.source.readAll().then(function () {
            me.controls.fillControls(me.source);
            xs.nextTick(function () {
                me.grid.source = getDistinctSource(me.source);
                me.grid.load();
            });
        }, function (error) {
            throw error;
        });
    };

    var getDistinctSource = function (source) {
        var query = new xs.data.Query(source);

        query.group(function (model) {
            return {
                user: model.user.get(),
                device: model.device.get(),
                test: model.test.get(),
                stage: model.stage.get(),
                name: model.name.get(),
                userAgent: model.userAgent.get()
            };
        }, {
            asArray: true
        });

        query.select(function (item) {
            return item.group[ 0 ];
        });

        return query.execute();
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
                test: {
                    label: 'Тест',
                    field: 'test'
                },
                stage: {
                    label: 'Этап',
                    field: 'stage'
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