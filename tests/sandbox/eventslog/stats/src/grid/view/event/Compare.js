xs.define(xs.Class, 'ns.view.event.Compare', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.implements = [
        'xs.view.event.IEvent'
    ];

    /**
     * Event constructor
     *
     * @constructor
     *
     * @param {Object} models event models collection
     */
    Class.constructor = function (models) {
        var me = this;

        self.assert.ok(models instanceof xs.core.Collection, 'constructor - given models `$models` are not a `$Collection` instance', {
            $models: models,
            $Collection: xs.core.Collection
        });

        me.private.models = models;
    };

    Class.property.models = {
        set: xs.noop
    };

});