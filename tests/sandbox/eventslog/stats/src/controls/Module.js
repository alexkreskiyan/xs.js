xs.define(xs.Class, 'ns.Module', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.controls';

    Class.imports = [
        {
            Container: 'ns.Container'
        },
        {
            Group: 'ns.Group'
        },
        {
            Field: 'ns.Field'
        }
    ];

    Class.constructor = function () {
        var me = this;
        me.container = new imports.Container();
        me.container.attributes.set('id', 'controls');

        //add common settings group
        var common = new imports.Group({
            name: 'common',
            label: 'Общие настройки'
        });
        me.container.items.add(common);
        fillCommon(common);

        //add browser group
        var browser = new imports.Group({
            name: 'browser',
            label: 'Браузер'
        });
        me.container.items.add(browser);
        fillBrowser(browser);

        //add engine group
        var engine = new imports.Group({
            name: 'engine',
            label: 'Движок'
        });
        me.container.items.add(engine);
        fillEngine(engine);

        //add environment group
        var environment = new imports.Group({
            name: 'environment',
            label: 'Окружение'
        });
        me.container.items.add(environment);
        fillEvironment(environment);

    };

    function fillCommon(group) {
        //user
        var user = new imports.Field({
            name: 'user',
            label: 'Пользователь'
        });
        group.items.add(user);

        //device
        var device = new imports.Field({
            name: 'device',
            label: 'Устройство'
        });
        group.items.add(device);

        //category
        var category = new imports.Field({
            name: 'category',
            label: 'Категория'
        });
        group.items.add(category);

        //name
        var name = new imports.Field({
            name: 'name',
            label: 'Название'
        });
        group.items.add(name);
    }

    function fillBrowser(group) {
        //name
        var name = new imports.Field({
            name: 'name',
            label: 'Название'
        });
        group.items.add(name);

        //version
        var version = new imports.Field({
            name: 'version',
            label: 'Версия'
        });
        group.items.add(version);

        //major
        var major = new imports.Field({
            name: 'major',
            label: 'Мажорная версия'
        });
        group.items.add(major);

        //minor
        var minor = new imports.Field({
            name: 'minor',
            label: 'Минорная версия'
        });
        group.items.add(minor);
    }

    function fillEngine(group) {
        //name
        var name = new imports.Field({
            name: 'name',
            label: 'Название'
        });
        group.items.add(name);

        //version
        var version = new imports.Field({
            name: 'version',
            label: 'Версия'
        });
        group.items.add(version);

        //major
        var major = new imports.Field({
            name: 'major',
            label: 'Мажорная версия'
        });
        group.items.add(major);

        //minor
        var minor = new imports.Field({
            name: 'minor',
            label: 'Минорная версия'
        });
        group.items.add(minor);
    }

    function fillEvironment(group) {
        //os name
        var name = new imports.Field({
            name: 'name',
            label: 'Название'
        });
        group.items.add(name);

        //os version
        var version = new imports.Field({
            name: 'version',
            label: 'Версия'
        });
        group.items.add(version);

        //os architecture
        var architecture = new imports.Field({
            name: 'architecture',
            label: 'Архитектура'
        });
        group.items.add(architecture);
    }

});