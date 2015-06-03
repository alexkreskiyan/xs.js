xs.define(xs.Class, 'ns.data.store.Log', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats';

    Class.imports = [
        {
            Model: 'ns.data.model.Entry'
        }
    ];

    Class.extends = 'xs.data.Source';

    Class.implements = [
        'xs.data.operation.source.IReadAll'
    ];

    Class.constant.model = xs.lazy(function () {
        return imports.Model;
    });

    Class.method.readAll = function () {
        var me = this;

        self.assert.ok(me.proxy, 'readAll - source has no proxy');

        return me.proxy.readAll().then(function (data) {

            //remove all current data
            me.remove();

            //add item
            for (var i = 0; i < data.length; i++) {
                me.add(new self.model(data[ i ]));
            }

            return null;
        });
    };

});