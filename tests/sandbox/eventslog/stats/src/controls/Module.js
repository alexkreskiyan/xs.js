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
            'view.Container': 'ns.view.Container'
        },
        {
            'view.Group': 'ns.view.Group'
        },
        {
            'view.Field': 'ns.view.Field'
        }
    ];

    Class.constructor = function () {
        var me = this;
        me.container = new imports.view.Container();
        me.container.attributes.set('id', 'controls');

        fillContainer(me.container);

        var source = me.source = new imports.data.store.Log();
        source.proxy = new imports.data.proxy.Xhr();
        source.proxy.reader = new imports.reader.JSON();

        source.readAll().then(function () {
            console.log('source loaded', source.values());
        }, function (error) {
            console.error(error);
        })
    };

    function fillContainer(container) {

        //add common settings group
        var common = new imports.view.Group({
            name: 'common',
            label: 'Общие настройки'
        });
        container.items.add(common);
        fillCommon(common);

        //add browser group
        var browser = new imports.view.Group({
            name: 'browser',
            label: 'Браузер'
        });
        container.items.add(browser);
        fillBrowser(browser);

        //add engine group
        var engine = new imports.view.Group({
            name: 'engine',
            label: 'Движок'
        });
        container.items.add(engine);
        fillEngine(engine);

        //add environment group
        var environment = new imports.view.Group({
            name: 'environment',
            label: 'Окружение'
        });
        container.items.add(environment);
        fillEvironment(environment);
    }

    function fillCommon(group) {
        //user
        var user = new imports.view.Field({
            name: 'user',
            label: 'Пользователь'
        });
        group.items.add(user);

        //device
        var device = new imports.view.Field({
            name: 'device',
            label: 'Устройство'
        });
        group.items.add(device);

        //category
        var category = new imports.view.Field({
            name: 'category',
            label: 'Категория'
        });
        group.items.add(category);

        //name
        var name = new imports.view.Field({
            name: 'name',
            label: 'Название'
        });
        group.items.add(name);
    }

    function fillBrowser(group) {
        //name
        var name = new imports.view.Field({
            name: 'name',
            label: 'Название'
        });
        group.items.add(name);

        //version
        var version = new imports.view.Field({
            name: 'version',
            label: 'Версия'
        });
        group.items.add(version);

        //major
        var major = new imports.view.Field({
            name: 'major',
            label: 'Мажорная версия'
        });
        group.items.add(major);

        //minor
        var minor = new imports.view.Field({
            name: 'minor',
            label: 'Минорная версия'
        });
        group.items.add(minor);
    }

    function fillEngine(group) {
        //name
        var name = new imports.view.Field({
            name: 'name',
            label: 'Название'
        });
        group.items.add(name);

        //version
        var version = new imports.view.Field({
            name: 'version',
            label: 'Версия'
        });
        group.items.add(version);

        //major
        var major = new imports.view.Field({
            name: 'major',
            label: 'Мажорная версия'
        });
        group.items.add(major);

        //minor
        var minor = new imports.view.Field({
            name: 'minor',
            label: 'Минорная версия'
        });
        group.items.add(minor);
    }

    function fillEvironment(group) {
        //os name
        var name = new imports.view.Field({
            name: 'name',
            label: 'Название'
        });
        group.items.add(name);

        //os version
        var version = new imports.view.Field({
            name: 'version',
            label: 'Версия'
        });
        group.items.add(version);

        //os architecture
        var architecture = new imports.view.Field({
            name: 'architecture',
            label: 'Архитектура'
        });
        group.items.add(architecture);
    }

});