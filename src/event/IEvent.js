/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
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
     * Event data property. Event data must be stored here, when event is constructed
     *
     * @property data
     *
     * @type {Object}
     */
    Interface.property.data = {
        set: xs.emptyFn
    };
});