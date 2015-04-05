/**
 * Event class for events, being thrown after all data was removed from xs.util.Collection
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.util.collection.ClearEvent
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.ClearEvent', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.util.collection';

    Class.implements = [
        'ns.IEvent'
    ];

    /**
     * Event constructor
     *
     * @constructor
     */
    Class.constructor = function () {
    };

});