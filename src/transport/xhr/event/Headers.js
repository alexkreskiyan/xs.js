/**
 * Event class for events, being thrown
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.xhr.event.Headers
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Set', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.xhr.event';

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

});