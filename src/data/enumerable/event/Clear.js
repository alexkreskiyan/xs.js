/**
 * Event class for events, being thrown after all data was removed from xs.data.Collection
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.data.enumerable.event.Clear
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Clear', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.data.enumerable.event';

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