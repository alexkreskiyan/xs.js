xs.define(xs.Class, 'ns.Reporter', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests';

    Class.imports = {
        message: {
            Outgoing: 'tests.data.proxy.message.Outgoing'
        },
        websocket: {
            Connection: 'xs.transport.websocket.Connection'
        },
        UserInfo: 'ns.UserInfo'
    };

    Class.constructor = function (connection) {
        var me = this;

        //verify connection
        self.assert.ok(connection instanceof imports.websocket.Connection, 'constructor - given connection `$connection` is not an instanceof `$Connection`', {
            $connection: connection,
            $Connection: imports.Connection
        });

        me.private.connection = connection;
    };

    Class.method.report = function (category, name, event) {
        var me = this;

        var connection = me.private.connection;

        var data = {
            user: imports.UserInfo.user,
            device: imports.UserInfo.device,
            time: getTime(),
            userAgent: xs.env.Context,
            category: category,
            name: name,
            event: serialize(event, 4)
        };

        var message = new imports.message.Outgoing('log', 'add', data);

        connection.send(JSON.stringify(message.get()));
    };

    //TODO - maximum depth, but prevent circularity
    var serialize = function (item, depth) {
        if (typeof item !== 'object' || item === null) {

            return serializeNonObject(item);
        }

        var result = {
            prototype: {}
        };
        var ownKeys = Object.keys(item);

        var prototype = result.prototype;
        var prototypeKeys = Object.keys(item.constructor.prototype);

        var i, key;

        if (depth <= 1) {

            for (i = 0; i < ownKeys.length; i++) {
                key = ownKeys[ i ];
                result[ key ] = serializeNonObject(item[ key ]);
            }

            for (i = 0; i < prototypeKeys.length; i++) {
                key = prototypeKeys[ i ];
                prototype[ key ] = serializeNonObject(item[ key ]);
            }

        } else {

            for (i = 0; i < ownKeys.length; i++) {
                key = ownKeys[ i ];
                result[ key ] = serialize(item[ key ], depth - 1);
            }

            for (i = 0; i < prototypeKeys.length; i++) {
                key = prototypeKeys[ i ];
                prototype[ key ] = serialize(item[ key ], depth - 1);
            }

        }

        return result;
    };

    var getTime = function () {
        var date = new Date();

        return [
                leadZero(date.getDate(), 2),
                leadZero(date.getMonth() + 1, 2),
                date.getFullYear()
            ].join('.') + ' ' + [
                leadZero(date.getHours(), 2),
                leadZero(date.getMinutes(), 2),
                leadZero(date.getSeconds(), 2)
            ].join(':') + '.' + leadZero(date.getMilliseconds(), 3);
    };

    var leadZero = function (value, length) {
        //convert value to string
        value = value.toString();

        while (value.length < length) {
            value = '0' + value;
        }

        return value;
    };

    var serializeNonObject = function (item) {
        if (typeof item === 'function') {

            return 'fn ' + (item.name ? item.name : 'anonymous');
        }

        return String(item);
    };

});