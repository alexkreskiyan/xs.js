/**
 * Event class for events, being thrown, when executed request is aborted
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.transport.xhr.event.Abort
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.event.Abort', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.transport.xhr';

    Class.implements = [
        'xs.event.IEvent'
    ];

    /**
     * Event constructor
     *
     * @constructor
     *
     * @param {*} [reason] event abort reason
     */
    Class.constructor = function (reason) {
        var me = this;

        //save abort reason
        me.private.reason = reason;
    };

    /**
     * Event `reason` property. Event reason is a reason, that describes, why was request aborted
     *
     * @property reason
     *
     * @type {Object}
     */
    Class.property.reason = {
        set: xs.noop
    };

});