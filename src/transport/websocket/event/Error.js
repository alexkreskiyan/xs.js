/**
 * Event class for events, being thrown, when connection throws an exception
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.websocket.event.Error
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.event.Error', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.websocket';

    Class.implements = [
        'xs.event.IEvent'
    ];

});