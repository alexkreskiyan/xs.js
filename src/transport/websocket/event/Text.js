/**
 * Event class for events, being thrown, when socket achieved text data
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.websocket.event.Text
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.event.Text', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.websocket';

    Class.implements = [
        'xs.event.IEvent'
    ];

    /**
     * Event constructor
     *
     * @constructor
     *
     * @param {String} data event data
     */
    Class.constructor = function (data) {
        var me = this;

        //assert, that data is a string
        self.assert.string(data, 'constructor - given `$data` is not a string', {
            $data: data
        });

        //save event data
        me.private.data = data;
    };

    /**
     * Event `data` property. Event data is string data, received from server
     *
     * @property data
     *
     * @type {Object}
     */
    Class.property.data = {
        set: xs.noop
    };

});