/**
 * Event class for events, being thrown when pointer taps
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.view.event.pointer.Tap
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.pointer.Tap', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.view.event';

    Class.implements = [
        'ns.IEvent'
    ];

    /**
     * Event constructor
     *
     * @constructor
     *
     * @param {Object} event event data
     */
    Class.constructor = function (event) {
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