/**
 * Event class for events, being thrown, when socket achieved binary data
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.websocket.event.Binary
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.event.Binary', function (self) {

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
     * @param {ArrayBuffer|Blob} data event data
     */
    Class.constructor = function (data) {
        var me = this;

        //assert, that data is an ArrayBuffer or a Blob
        self.assert.ok(data instanceof ArrayBuffer || data instanceof Blob, 'constructor - given `$data` is not an instance of ArrayBuffer or Blob', {
            $data: data
        });

        //save event data
        me.private.data = data;
    };

    /**
     * Event `data` property. Event data is binary data container, recieved from server
     *
     * @property data
     *
     * @type {ArrayBuffer|Blob}
     */
    Class.property.data = {
        set: xs.noop
    };

});