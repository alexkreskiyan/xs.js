/**
 * Events common interface
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.event.IEvent
 *
 * @extends xs.interface.Base
 */
xs.define(xs.Interface, 'ns.IEvent', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.event';


    /**
     * Event constructor.
     *
     * @constructor
     *
     * @param {Object} [data] event data
     */
    Interface.constructor = function (data) {

    };

    /**
     * Event data property. Event data must be stored here, when event is constructed
     *
     * @property data
     *
     * @type {Object}
     */
    Interface.property.data = {
        set: xs.noop
    };

});