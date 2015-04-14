/**
 * Key data workflow element of xs.js.
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.proxy.storage.Local
 *
 * @extends xs.data.proxy.Proxy
 */
xs.define(xs.Class, 'ns.proxy.storage.Local', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data';

    Class.imports = [
        {
            Storage: 'xs.storage.Local'
        }
    ];

    Class.extends = 'ns.proxy.Proxy';

    Class.implements = [
        'ns.proxy.IProxy',
        'ns.operation.source.ICreate',
        'ns.operation.source.IRead',
        'ns.operation.source.IUpdate',
        'ns.operation.source.IDelete'
    ];

    Class.method.create = function (model) {
        var me = this;

        //get key
        var key = getKey(model);

        //reject operation, if storage has value with that key already
        if (imports.Storage.hasKey(key)) {
            operation.reject('key already exists');

            return;
        }

        var raw = {};
        model.self.attributes.each(function (config, name) {
            raw[ name ] = model.data[ name ].get(); //TODO needed to use specific saving format
        });

        //add new value to storage
        imports.Storage.add(key, me.writer.write(raw));

        //resolve operation
        operation.resolve();
    };

    Class.method.createAll = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.createAll.call(me, operation);
    };

    Class.method.read = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.read.call(me, operation);

        //get model reference
        var model = operation.model;

        //get key
        var key = getKey(model);

        //reject operation, if storage has no value with that key
        if (!imports.Storage.hasKey(key)) {
            operation.reject('not found');

            return;
        }

        var raw = me.reader.read(imports.Storage.at(key));
        model.self.attributes.each(function (config, name) {
            model.data[ name ].set(raw[ name ], true);
        });

        //resolve operation
        operation.resolve();
    };

    Class.method.getCount = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.getCount.call(me, operation);
    };

    Class.method.readAll = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.readAll.call(me, operation);
    };

    Class.method.update = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.update.call(me, operation);

        //get model reference
        var model = operation.model;

        //get key
        var key = getKey(model);

        //reject operation, if storage has no value with that key
        if (!imports.Storage.hasKey(key)) {
            operation.reject('not found');

            return;
        }

        var raw = {};
        model.self.attributes.each(function (config, name) {
            raw[ name ] = model.data[ name ].get(); //TODO needed to use specific saving format
        });

        //add new value to storage
        imports.Storage.set(key, me.writer.write(raw));

        //resolve operation
        operation.resolve();
    };

    Class.method.updateAll = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.updateAll.call(me, operation);
    };

    Class.method.delete = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.delete.call(me, operation);

        //get model reference
        var model = operation.model;

        //get key
        var key = getKey(model);

        //reject operation, if storage has no value with that key
        if (!imports.Storage.hasKey(key)) {
            operation.reject('not found');

            return;
        }

        //remove value from storage by key
        imports.Storage.removeAt(key);

        //resolve operation
        operation.resolve();
    };

    Class.method.deleteAll = function (operation) {
        var me = this;

        //call parent
        self.parent.prototype.deleteAll.call(me, operation);
    };

    var getKey = function (model) {

        return model.self.primaryAttributes.reduce(function (memo, value) {
            return memo + ':' + model.data[ value ].get(); //TODO needed to use specific saving format
        }, 0, undefined, model.self.label);
    };
});