xs.define(xs.Class, 'ns.event.Select', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'stats.controls';

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
        //assert that data is an object
        self.assert.object(data, 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assert that data.field is a string
        self.assert.string(data.field, 'constructor - given data.field `$field` is not a string', {
            $field: data.field
        });

        //assert that data.value is a string or a xs.core.Collection
        self.assert.ok(xs.isString(data.value) || data.value instanceof xs.core.Collection, 'constructor - given data.value `$value` is not a string or xs.core.Collection', {
            $value: data.value
        });

        //save data to privates
        me.private.field = data.field;
        me.private.value = data.value;
    };

    /**
     * Event `field` property. Event field is name of selected field
     *
     * @property value
     *
     * @type {Object}
     */
    Class.property.field = {
        set: xs.noop
    };

    /**
     * Event `value` property. Event value is value of changed control
     *
     * @property value
     *
     * @type {Object}
     */
    Class.property.value = {
        set: xs.noop
    };

});