xs.define(xs.Class, 'ns.data.proxy.message.Outgoing', function (self) {
    'use strict';

    var Class = this;

    Class.namespace = 'tests';

    Class.constructor = function (controller, action, data) {
        var me = this;

        self.assert.string(controller, 'constructor - given controller `$controller` is not an object', {
            $controller: controller
        });

        self.assert.string(action, 'constructor - given action `$action` is not an object', {
            $action: action
        });

        //save to privates
        me.private.controller = controller;
        me.private.action = action;
        me.private.data = data;
    };

    Class.property.controller = {
        set: xs.noop
    };

    Class.property.action = {
        set: xs.noop
    };

    Class.property.data = {
        set: xs.noop
    };

    Class.method.get = function () {
        var me = this;

        return {
            controller: me.private.controller,
            action: me.private.action,
            data: me.private.data
        };
    };

});