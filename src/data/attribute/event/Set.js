/**
 * Event class for events, being thrown after attribute value is changed
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.attribute.Set
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Set', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.attribute.event';

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
        me.private.attribute = data.attribute;
        me.private.old = data.old;
        me.private.new = data.new;
    };

    /**
     * Event `attribute` property. Event attribute is name of changed attribute
     *
     * @property attribute
     *
     * @type {Object}
     */
    Class.property.attribute = {
        set: xs.noop
    };

    /**
     * Event `old` property. Event old is old value at given position
     *
     * @property old
     *
     * @type {Object}
     */
    Class.property.old = {
        set: xs.noop
    };

    /**
     * Event `new` property. Event new is a value, that replaces current one
     *
     * @property new
     *
     * @type {Object}
     */
    Class.property.new = {
        set: xs.noop
    };

});