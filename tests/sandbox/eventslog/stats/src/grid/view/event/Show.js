xs.define(xs.Class, 'ns.view.event.Compare', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.imports = [
        {
            Model: 'xs.data.Model'
        }
    ];

    Class.implements = [
        'xs.view.event.IEvent'
    ];

    /**
     * Event constructor
     *
     * @constructor
     *
     * @param {Object} model event models collection
     */
    Class.constructor = function (model) {
        var me = this;

        self.assert.ok(model instanceof imports.Model, 'constructor - given model `$model` is not a `$Model` instance', {
            $model: model,
            $Model: imports.Model
        });

        me.private.model = model;
    };

    Class.property.model = {
        set: xs.noop
    };

});