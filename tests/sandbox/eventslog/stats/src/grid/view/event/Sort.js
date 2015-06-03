xs.define(xs.Class, 'ns.view.event.Sort', function (self) {

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
     * @param {Object} data event data
     */
    Class.constructor = function (data) {
        var me = this;

        //check data
        //assert that data is object
        self.assert.object(data, 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assert that direction is given
        self.assert.string(data.field, 'constructor - given data.field `$field` is not a string', {
            $field: data.field
        });

        //assert that data is object
        self.assert.string(data.direction, 'constructor - given data.direction `$direction` is not a string', {
            $direction: data.direction
        });

        me.private.field = data.field;
        me.private.direction = data.direction;
    };

    Class.property.field = {
        set: xs.noop
    };

    Class.property.direction = {
        set: xs.noop
    };

});