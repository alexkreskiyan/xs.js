xs.define(xs.Class, 'ns.view.event.Select', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.grid';

    Class.imports = {
        Model: 'xs.data.Model'
    };

    Class.implements = [
        'xs.event.IEvent'
    ];

    /**
     * Event constructor
     *
     * @constructor
     *
     * @param {Object} data event data
     */
    Class.constructor = function (data) {
        var me = this;

        self.assert.object(data, 'constructor - given data `$data` is not an object', {
            $data: data
        });

        self.assert.ok(data.model instanceof imports.Model, 'constructor - given data.model `$model` is not a `$Model` instance', {
            $model: data.model,
            $Model: imports.Model
        });

        self.assert.boolean(data.state, 'constructor - given data.state `$state` is not a boolean', {
            $state: data.state
        });

        me.private.model = data.model;
        me.private.state = data.state;
    };

    Class.property.model = {
        set: xs.noop
    };

    Class.property.state = {
        set: xs.noop
    };

});