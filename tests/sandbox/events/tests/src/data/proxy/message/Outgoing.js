xs.define(xs.Class, 'ns.data.proxy.message.Outgoing', function (self) {
    'use strict';

    var Class = this;

    Class.namespace = 'tests';

    Class.constructor = function (id, controller, action, data) {
        var me = this;

        self.assert.number(id, 'constructor - given id `$id` is not a number', {
            $id: id
        });

        self.assert.string(controller, 'constructor - given controller `$controller` is not a string', {
            $controller: controller
        });

        self.assert.string(action, 'constructor - given action `$action` is not a string', {
            $action: action
        });

        //save to privates
        me.private.id = id;
        me.private.controller = controller;
        me.private.action = action;
        me.private.data = data;
    };

    Class.property.id = {
        set: xs.noop
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
            id: me.private.id,
            controller: me.private.controller,
            action: me.private.action,
            data: me.private.data
        };
    };

});