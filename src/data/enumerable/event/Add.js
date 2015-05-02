/**
 * Event class for events, being thrown after some data is added to xs.util.Collection
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.util.collection.event.Add
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Add', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.util.collection.event';

    Class.implements = [
        'xs.event.IEvent'
    ];

    /**
     * Event constructor
     *
     * @constructor
     *
     * @param {Object} [data] event data
     */
    Class.constructor = function (data) {
        var me = this;

        if (!arguments.length) {

            return;
        }

        //check data
        //assert that data is object
        self.assert.ok(xs.isObject(data), 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assign attributes
        me.private.value = data.value;
        me.private.key = data.key;
        me.private.index = data.index;
    };

    /**
     * Event `value` property. Event value is value, operation is performed on
     *
     * @property value
     *
     * @type {Object}
     */
    Class.property.value = {
        set: xs.noop
    };

    /**
     * Event `key` property. Event key is key of value, operation is performed on
     *
     * @property key
     *
     * @type {Object}
     */
    Class.property.key = {
        set: xs.noop
    };

    /**
     * Event `index` property. Event index is index of value, operation is performed on
     *
     * @property index
     *
     * @type {Object}
     */
    Class.property.index = {
        set: xs.noop
    };

});