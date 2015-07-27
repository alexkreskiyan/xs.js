/**
 * Event class for events, being thrown, while response body is downloaded to mark process progress
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.http.event.LoadProgress
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.event.LoadProgress', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.http';

    Class.implements = [
        'xs.event.IEvent'
    ];

    /**
     * Event constructor
     *
     * @constructor
     */
    Class.constructor = function (data) {
        var me = this;

        //assert, that data is an object
        self.assert.object(data, 'constructor - given data `$data` is not an object', {
            $data: data
        });

        me.private.loaded = data.loaded;
        me.private.total = data.total;
    };

    /**
     * Event `loaded` property. Event loaded is a size of loaded response's part in bytes
     *
     * @property loaded
     *
     * @type {Number}
     */
    Class.property.loaded = {
        set: xs.noop
    };

    /**
     * Event `total` property. Event total is a response size in bytes
     *
     * @property total
     *
     * @type {Number}
     */
    Class.property.total = {
        set: xs.noop
    };

});