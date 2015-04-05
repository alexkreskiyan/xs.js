/**
 * Event class for events, being thrown after all data is removed from xs.storage.WebStorage
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.storage.event.Clear
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Clear', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.storage.event';

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