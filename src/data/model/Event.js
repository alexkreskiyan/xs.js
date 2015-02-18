/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * This event is used in data manipulations with xs.data.Model attributes.
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

    Class.namespace = 'xs.data.model';

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
        me.private.attribute = data.attribute;
        me.private.old = data.old;
        me.private.new = data.new;
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
     * Event attribute property. Event attribute contains name of changed attribute
     *
     * @property attribute
     *
     * @type {String}
     */
    Class.property.attribute = {
        set: xs.emptyFn
    };

    /**
     * Event old property. Event old is value, that is currently assigned to attribute
     *
     * @property old
     *
     * @type {*}
     */
    Class.property.old = {
        set: xs.emptyFn
    };

    /**
     * Event new property. Event new is value, that is being assigned to attribute
     *
     * @property new
     *
     * @type {O*bject}
     */
    Class.property.new = {
        set: xs.emptyFn
    };

});