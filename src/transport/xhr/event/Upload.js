/**
 * Event class for events, being thrown, when request body is uploaded completely
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.xhr.event.Upload
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.event.Upload', function (self, imports) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.xhr';

    Class.implements = [
        'xs.event.IEvent'
    ];

});