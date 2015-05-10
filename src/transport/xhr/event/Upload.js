/**
 * Event class for events, being thrown, when request body is uploaded completely
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.xhr.event.Upload
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Upload', function () {

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