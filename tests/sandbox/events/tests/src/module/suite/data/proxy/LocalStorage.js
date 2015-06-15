xs.define(xs.Class, 'ns.data.proxy.LocalStorage', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        attribute: {
            Format: 'xs.data.attribute.Format'
        },
        Model: 'xs.data.Model',
        Storage: 'xs.storage.Local'
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

        //verify config.commonKey
        self.assert.string(config.commonKey, 'constructor - given config.commonKey `$commonKey` is not a string', {
            $commonKey: config.commonKey
        });

        self.parent.call(me, config);

        //save commonKey
        me.private.commonKey = config.commonKey;
    };

    Class.method.create = function (model) {
        var me = this;

        self.assert.ok(model instanceof imports.Model, 'create - given `$model` is not a `$Model` instance', {
            $model: model,
            $Model: imports.Model
        });

        self.assert.ok(me.writer, 'create - no writer defined');

        //get key
        var key = evaluateKey.call(me, me.writer.write(model.primary(imports.attribute.Format.Storage)));

        var promise = new xs.core.Promise();
        var storage = imports.Storage;

        xs.nextTick(function () {
            //reject if model already exists
            if (storage.hasKey(key)) {
                promise.reject();
            } else {
                //add new entry to storage and resolve promise
                storage.add(key, me.writer.write(model.get(imports.attribute.Format.Storage)));
                promise.resolve();
            }
        });

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

        //get key
        key = evaluateKey.call(me, me.writer.write(key));

        var promise = new xs.core.Promise();
        var storage = imports.Storage;

        xs.nextTick(function () {
            //resolve if storage has that key
            if (storage.hasKey(key)) {
                promise.resolve(me.reader.read(storage.at(key)));
            } else {
                //reject otherwise
                promise.reject();
            }
        });

        return promise;
    };

    Class.method.readAll = function () {
        var me = this;

        self.assert.ok(me.reader, 'create - no reader defined');

        var promise = new xs.core.Promise();
        var storage = imports.Storage;

        xs.nextTick(function () {
            //resolve promise with data from storage
            promise.resolve(storage.find(function (value, key) {

                return key.indexOf(me.private.commonKey) === 0 && key.length > me.private.commonKey.length;
            }, storage.All).map(function (value) {
                return me.reader.read(value);
            }));
        });

        return promise;
    };

    Class.method.update = function (model) {
        var me = this;

        self.assert.ok(model instanceof imports.Model, 'create - given `$model` is not a `$Model` instance', {
            $model: model,
            $Model: imports.Model
        });

        self.assert.ok(me.writer, 'create - no writer defined');

        //get key
        var key = evaluateKey.call(me, me.writer.write(model.primary(imports.attribute.Format.Storage)));

        var promise = new xs.core.Promise();
        var storage = imports.Storage;

        xs.nextTick(function () {
            //update model if exists
            if (storage.hasKey(key)) {
                storage.set(key, me.writer.write(model.get(imports.attribute.Format.Storage)));
                promise.resolve();
            } else {
                //reject if missing
                promise.reject();
            }
        });

        return promise;
    };

    var evaluateKey = function (key) {
        var me = this;

        var commonKey = me.private.commonKey;

        return commonKey + key;
    };

});