/**
 * Event class for events, being thrown, when executed request is aborted
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.websocket.event.Abort
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.event.Open', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.websocket';

    Class.implements = [
        'xs.event.IEvent'
    ];

});