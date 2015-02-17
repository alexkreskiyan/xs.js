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
 * @class xs.util.collection.Event
 *
 * @extends xs.class.Base
 */
xs.define(xs.Class, 'ns.Event', function (self) {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.util.collection';

    Class.implements = [
        'xs.event.IEvent'
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

        if (!arguments.length) {

            return;
        }

        //check data
        //assert that data is object
        self.assert.ok(xs.isObject(data), 'constructor - given data `$data` is not an object', {
            $data: data
        });

        //assign attributes
        me.private.data = data;
        me.private.value = data.value;
        me.private.key = data.key;
        me.private.index = data.index;
    };

    /**
     * Event data property. Event data is stored here
     *
     * @property data
     *
     * @type {Object}
     */
    Class.property.data = {
        set: xs.emptyFn
    };

    /**
     * Event value property. Event value is value, operation is performed on
     *
     * @property value
     *
     * @type {Object}
     */
    Class.property.value = {
        set: xs.emptyFn
    };

    /**
     * Event key property. Event key is key of value, operation is performed on
     *
     * @property key
     *
     * @type {Object}
     */
    Class.property.key = {
        set: xs.emptyFn
    };

    /**
     * Event index property. Event index is index of value, operation is performed on
     *
     * @property index
     *
     * @type {Object}
     */
    Class.property.index = {
        set: xs.emptyFn
    };

});