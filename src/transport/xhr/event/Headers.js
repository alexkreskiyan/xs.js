/**
 * Event class for events, being thrown, when response headers recieved
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.xhr.event.Headers
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Headers', function () {

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
     */
    Class.constructor = function () {

    };

});