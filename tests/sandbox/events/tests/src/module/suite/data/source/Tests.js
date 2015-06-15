xs.define(xs.Class, 'ns.data.source.Tests', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'tests.module.suite';

    Class.imports = {
        Model: 'ns.data.model.Test'
    };

    Class.extends = 'xs.data.Source';

    Class.implements = [
        'xs.data.operation.source.ICreate',
        'xs.data.operation.source.IRead',
        'xs.data.operation.source.IReadAll',
        'xs.data.operation.source.IUpdate'
    ];

    Class.constant.model = xs.lazy(function () {
        return imports.Model;
    });

    Class.method.create = function (model) {
        var me = this;

        self.assert.ok(model instanceof imports.Model, 'create - given `$model` is not an instance of `$Model`', {
            $model: model,
            $Model: imports.Model
        });

        self.assert.ok(me.proxy, 'create - source has no proxy');

        return me.proxy.create(model).then(function () {
            me.add(model.primary(), model);
        });
    };

    Class.method.read = function (key) {
        var me = this;

        self.assert.ok(me.proxy, 'read - source has no proxy');

        return me.proxy.read(key).then(function (data) {
            var model = new me.self.model(data);
            me.add(model.primary(), model);
        });
    };

    Class.method.readAll = function () {
        var me = this;

        self.assert.ok(me.proxy, 'readAll - source has no proxy');

        return me.proxy.readAll().then(function (data) {

            //remove all current data
            me.remove();

            //add item
            data.each(function () {
                var model = new me.self.model(data);
                me.add(model.primary(), model);
            });
        });
    };

    Class.method.update = function (model) {
        var me = this;

        self.assert.ok(model instanceof imports.Model, 'update - given `$model` is not an instance of `$Model`', {
            $model: model,
            $Model: imports.Model
        });

        self.assert.ok(me.proxy, 'update - source has no proxy');

        return me.proxy.update(model);
    };

});