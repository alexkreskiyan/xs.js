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
        me.container.items.add(new imports.Group({
            name: 'common',
            label: 'Общие настройки'
        }));
        me.container.items.add(new imports.Group({
            name: 'browser',
            label: 'Браузер'
        }));
        me.container.items.add(new imports.Group({
            name: 'engine',
            label: 'Движок'
        }));
        me.container.items.add(new imports.Group({
            name: 'environment',
            label: 'Окружение'
        }));
    };

});