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
            while (!xs.isString(user) || user.length < 3) {
                user = prompt('Who are you, %username%?');
            }
            storage.add('user', user);
        }

        if (storage.hasKey('device')) {
            device = storage.at('device');
        } else {
            while (!xs.isString(device) || device.length < 3) {
                device = prompt(xs.translate('What is your device, $user?', {
                    $user: user
                }));
            }
            storage.add('device', device);
        }

        me.private.user = user;
        me.private.device = device;
    };

});