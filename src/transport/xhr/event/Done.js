/**
 * Event class for events, being thrown, when response is done (with any result - abort, error, timeout, success)
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.xhr.event.Done
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Done', function () {

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