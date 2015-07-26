/**
 * Event class for events, being thrown, when request execution failed due to some error
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.http.event.Error
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.event.Error', function () {

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
     *
     * @param {*} [reason] event error reason
     */
    Class.constructor = function (reason) {
        var me = this;

        //save abort reason
        me.private.reason = reason;
    };

    /**
     * Event `reason` property. Event reason is a reason, that describes, why request failed
     *
     * @property reason
     *
     * @type {Object}
     */
    Class.property.reason = {
        set: xs.noop
    };

});