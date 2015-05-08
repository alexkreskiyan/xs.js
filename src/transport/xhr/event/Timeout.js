/**
 * Event class for events, being thrown, when response is aborted because of timeout
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.xhr.event.Timeout
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Timeout', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.xhr.event';

    Class.implements = [
        'xs.event.IEvent'
    ];

});