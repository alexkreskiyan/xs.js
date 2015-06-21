xs.define(xs.Class, 'ns.data.proxy.WebSocket', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        attribute: {
            Format: 'xs.data.attribute.Format'
        },
        message: {
            Incoming: 'tests.data.proxy.message.Incoming',
            Outgoing: 'tests.data.proxy.message.Outgoing'
        },
        Model: 'xs.data.Model',
        websocket: {
            event: {
                Text: 'xs.transport.websocket.event.Text'
            },
            Connection: 'xs.transport.websocket.Connection'
        },
        UserInfo: 'tests.UserInfo'
    };

    Class.extends = 'xs.data.Proxy';

    Class.implements = [
        'xs.data.operation.source.ICreate',
        'xs.data.operation.source.IRead',
        'xs.data.operation.source.IReadAll',
        'xs.data.operation.source.IUpdate'
    ];

    Class.constructor = function (config) {
        var me = this;

        //verify config
        self.assert.object(config, 'constructor - given `$config` is not an object', {
            $config: config
        });

        //verify config.connection
        self.assert.ok(config.connection instanceof imports.websocket.Connection, 'constructor - given config.connection `$connection` is not an instanceof `$Connection`', {
            $connection: config.connection,
            $Connection: imports.Connection
        });

        self.parent.call(me, config);

        //save connection
        me.private.connection = config.connection;

        self.assert.string(config.dbName, 'constructor - given config.dbName `$dbName` is not a string', {
            $dbName: config.dbName
        });

        me.private.dbName = config.dbName;

        var events = me.private.connection.events
            .filter(imports.websocket.event.Text)
            .map(function (event) {

                return new imports.message.Incoming(me.reader.read(event.data));
            })
            .filter(function (message) {

                return message.controller === 'tests';
            });

        me.private.streams = {
            create: events.filter(function (message) {

                return message.action === 'create';
            }),
            read: events.filter(function (message) {

                return message.action === 'read';
            }),
            readAll: events.filter(function (message) {

                return message.action === 'readAll';
            }),
            update: events.filter(function (message) {

                return message.action === 'update';
            })
        };
    };

    Class.method.create = function (model) {
        var me = this;

        self.assert.ok(model instanceof imports.Model, 'create - given `$model` is not a `$Model` instance', {
            $model: model,
            $Model: imports.Model
        });

        self.assert.ok(me.writer, 'create - no writer defined');

        var connection = me.private.connection;
        var events = me.private.streams.create;
        var promise = new xs.core.Promise();
        var id = randomId();

        //add single handler
        var handler = function (message) {
            if (message.id !== id) {
                return;
            }

            //off handler
            xs.nextTick(function () {
                events.off(function (item) {
                    return item.handler === handler;
                });
            });

            if (message.status) {
                promise.resolve();
            } else {
                promise.reject();
            }
        };
        events.on(handler);

        var data = model.get(imports.attribute.Format.Storage);
        xs.apply(data, {
            dbName: me.private.dbName,
            user: imports.UserInfo.user,
            device: imports.UserInfo.device,
            userAgent: xs.context.userAgent
        });

        var message = new imports.message.Outgoing(id, 'tests', 'create', data);

        connection.send(me.writer.write(message.get()));

        return promise;
    };

    Class.method.read = function (key) {
        var me = this;

        //validate key - it must be name
        self.assert.string(key, 'read - given `$key` is not a valid string', {
            $key: key
        });

        self.assert.ok(me.writer, 'create - no writer defined');
        self.assert.ok(me.reader, 'create - no reader defined');

        var connection = me.private.connection;
        var events = me.private.streams.read;
        var promise = new xs.core.Promise();
        var id = randomId();

        //add single handler
        var handler = function (message) {
            if (message.id !== id) {
                return;
            }

            //off handler
            xs.nextTick(function () {
                events.off(function (item) {
                    return item.handler === handler;
                });
            });

            if (message.status) {
                promise.resolve(message.data);
            } else {
                promise.reject();
            }
        };
        events.on(handler);

        var data = {
            test: key,
            dbName: me.private.dbName,
            user: imports.UserInfo.user,
            device: imports.UserInfo.device,
            userAgent: xs.context.userAgent
        };

        var message = new imports.message.Outgoing(id, 'tests', 'read', data);

        connection.send(me.writer.write(message.get()));

        return promise;
    };

    Class.method.readAll = function () {
        var me = this;

        self.assert.ok(me.reader, 'create - no reader defined');

        var connection = me.private.connection;
        var events = me.private.streams.readAll;
        var promise = new xs.core.Promise();
        var id = randomId();

        //add single handler
        var handler = function (message) {
            if (message.id !== id) {
                return;
            }

            //off handler
            xs.nextTick(function () {
                events.off(function (item) {
                    return item.handler === handler;
                });
            });

            if (message.status) {
                promise.resolve(new xs.core.Collection(message.data));
            } else {
                promise.reject();
            }
        };
        events.on(handler);

        var data = {
            dbName: me.private.dbName,
            user: imports.UserInfo.user,
            device: imports.UserInfo.device,
            userAgent: xs.context.userAgent
        };

        var message = new imports.message.Outgoing(id, 'tests', 'readAll', data);

        connection.send(me.writer.write(message.get()));

        return promise;
    };

    Class.method.update = function (model) {
        var me = this;

        self.assert.ok(model instanceof imports.Model, 'create - given `$model` is not a `$Model` instance', {
            $model: model,
            $Model: imports.Model
        });

        self.assert.ok(me.writer, 'create - no writer defined');

        var connection = me.private.connection;
        var events = me.private.streams.update;
        var promise = new xs.core.Promise();
        var id = randomId();

        //add single handler
        var handler = function (message) {
            if (message.id !== id) {
                return;
            }

            //off handler
            xs.nextTick(function () {
                events.off(function (item) {
                    return item.handler === handler;
                });
            });

            if (message.status) {
                promise.resolve();
            } else {
                promise.reject();
            }
        };
        events.on(handler);

        var data = model.get(imports.attribute.Format.Storage);
        xs.apply(data, {
            dbName: me.private.dbName,
            user: imports.UserInfo.user,
            device: imports.UserInfo.device,
            userAgent: xs.context.userAgent
        });

        var message = new imports.message.Outgoing(id, 'tests', 'update', data);

        connection.send(me.writer.write(message.get()));

        return promise;
    };

    function randomId() {
        return Math.floor(Math.random() * 1000000);
    }

});