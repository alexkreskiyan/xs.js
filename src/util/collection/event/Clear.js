/**
 * Event class for events, being thrown after all data was removed from xs.util.Collection
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.util.collection.event.Clear
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Clear', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.util.collection.event';

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