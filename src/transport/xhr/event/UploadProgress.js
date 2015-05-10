/**
 * Event class for events, being thrown, while request body is uploaded to mark process progress
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.xhr.event.UploadProgress
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.UploadProgress', function () {

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