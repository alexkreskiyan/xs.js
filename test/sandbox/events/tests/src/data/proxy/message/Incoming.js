xs.define(xs.Class, 'ns.data.proxy.message.Incoming', function (self) {
    'use strict';

    var Class = this;

    Class.namespace = 'tests';

    Class.constructor = function (message) {
        var me = this;

        self.assert.object(message, 'constructor - given `$message` is not an object', {
            $message: message
        });

        self.assert.number(message.id, 'constructor - given message.id `$id` is not an number', {
            $id: message.id
        });

        self.assert.string(message.controller, 'constructor - given message.controller `$controller` is not a string', {
            $controller: message.controller
        });

        self.assert.string(message.action, 'constructor - given message.action `$action` is not a string', {
            $action: message.action
        });

        self.assert.boolean(message.status, 'constructor - given message.status `$status` is not a boolean', {
            $status: message.status
        });

        self.assert.array(message.messages, 'constructor - given message.messages `$messages` is not an array', {
            $messages: message.messages
        });

        self.assert.ok(message.hasOwnProperty('data'), 'constructor - no message.data given');

        //save to privates
        me.private.id = message.id;
        me.private.controller = message.controller;
        me.private.action = message.action;
        me.private.status = message.status;
        me.private.messages = message.messages;
        me.private.data = message.data;
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

    Class.property.status = {
        set: xs.noop
    };

    Class.property.messages = {
        set: xs.noop
    };

    Class.property.data = {
        set: xs.noop
    };

});