/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Base event class. It has common interface and can be used if no specific is required
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.event.Event
 */
xs.define(xs.Class, 'ns.Event', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.event';

    Class.implements = [
        'ns.IEvent'
    ];

    /**
     * Event constructor. If data object is given, event object is extended with data
     *
     * @constructor
     *
     * @param {Object} [data] event data
     */
    Class.constructor = function (data) {
        var me = this;

        //check data
        //assert that data is object (if given)
        xs.assert.ok(!arguments.length || xs.isObject(data), 'constructor - given data "$data" is not an object', {
            $data: data
        }, EventError);

        //assign
        me.private.data = data;
    };

    /**
     * Event data property. Event data is stored here, when event is constructed
     *
     * @property data
     *
     * @type {Object}
     */
    Class.property.data = {
        set: xs.emptyFn
    };

    /**
     * Internal error class
     *
     * @ignore
     *
     * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
     *
     * @class EventError
     */
    function EventError(message) {
        this.message = self.label + '::' + message;
    }

    EventError.prototype = new Error();
});