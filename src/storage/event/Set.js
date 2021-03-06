/**
 * Event class for events, being thrown after some data is removed from xs.storage.WebStorage
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.storage.event.Set
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Set', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.storage.event';

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
        me.private.old = data.old;
        me.private.new = data.new;
        me.private.key = data.key;
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

});