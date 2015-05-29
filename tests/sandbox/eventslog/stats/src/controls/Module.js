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
        me.container.items.add(new imports.Group({
            name: 'browser',
            label: 'Браузер'
        }));

        //add engine group
        me.container.items.add(new imports.Group({
            name: 'engine',
            label: 'Движок'
        }));

        //add environment group
        me.container.items.add(new imports.Group({
            name: 'environment',
            label: 'Окружение'
        }));
    };

    function fillCommon(group) {
        var user = new imports.Field({
            name: 'user',
            label: 'Пользователь'
        });
        group.items.add(user);
        var device = new imports.Field({
            name: 'device',
            label: 'Устройство'
        });
        group.items.add(device);
    }

});