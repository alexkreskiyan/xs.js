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

    Class.constructor = function (connection, dbName) {
        var me = this;

        //verify connection
        self.assert.ok(connection instanceof imports.websocket.Connection, 'constructor - given connection `$connection` is not an instanceof `$Connection`', {
            $connection: connection,
            $Connection: imports.Connection
        });

        me.private.connection = connection;
        me.private.dbName = dbName;
    };

    Class.method.report = function (test, stage, name, event) {
        var me = this;

        var connection = me.private.connection;

        var data = {
            dbName: me.private.dbName,
            user: imports.UserInfo.user,
            device: imports.UserInfo.device,
            time: getTime(),
            userAgent: xs.env.Context,
            test: test,
            stage: stage,
            name: name,
            event: serialize(event, new xs.core.Collection())
        };

        var message = new imports.message.Outgoing(randomId(), 'log', 'add', data);

        connection.send(JSON.stringify(message.get()));
    };

    var stringified = [
        Window,
        Document,
        Element,
        Date,
        CSSStyleDeclaration
    ];

    var serialize = function (item, parents) {
        if (xs.isNull(item) || !xs.isDefined(item)) {
            return item;
        } else if (stringified.filter(function (Ancestor) {
                return item instanceof Ancestor;
            }).length) {
            return item.toString();
        } else if (!xs.isObject(item) && !xs.isArray(item)) {
            return xs.isFunction(item) ? 'fn ' + (item.name ? item.name : 'anonymous') : item;
        }

        var result = {};

        //add root if needed
        if (!parents.size) {
            parents.add('root', item);
        }

        for (var key in item) {
            var value;

            try {
                value = item[ key ];
            } catch (e) {
                value = e.toString();
            }

            //if circular reference detected - mark it specially
            if (parents.has(value)) {
                result[ key ] = parents.keyOf(value);

                //else if value is picked - go deeper
            } else if (doPick(key, value)) {
                result[ key ] = serialize(value, parents.clone().add(parents.reduce(getName, 0, null, 'ref ' + key), value));
            }
        }

        return result;
    };

    function getName(memo, value, key) {
        return memo + '.' + key;
    }

    function doPick(key, value) {
        return key !== 'private';
    }

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

    function randomId() {
        return Math.floor(Math.random() * 1000000);
    }

});