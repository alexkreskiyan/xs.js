xs.define(xs.Class, 'ns.UserInfo', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests';

    Class.imports = {
        Storage: 'xs.storage.Local'
    };

    Class.static.property.user = {
        set: xs.noop
    };

    Class.static.property.device = {
        set: xs.noop
    };

    Class.static.method.authenticate = function () {
        var me = this;

        var user, device;
        var storage = imports.Storage;

        if (storage.hasKey('user')) {
            user = storage.at('user');
        } else {
            user = prompt('Who are you, %username%?');
            storage.add('user', user);
        }

        if (storage.hasKey('device')) {
            device = storage.at('device');
        } else {
            device = prompt(xs.translate('What is your device, $user?', {
                $user: user
            }));
            storage.add('device', device);
        }

        me.private.user = user;
        me.private.device = device;
    };

});