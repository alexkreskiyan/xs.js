/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * Model base interface
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.IModel
 *
 * @extends xs.interface.Base
 */
xs.define(xs.Interface, 'ns.IModel', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data';

    Interface.constant = ['attributes'];

    /**
     * Attribute constructor
     *
     * @constructor
     *
     * @param {Object} data attribute configuration object
     */
    Interface.constructor = function (data) {

    };

    /**
     * Model data accessor
     *
     * @readonly
     *
     * @property data
     *
     * @type {Object}
     */
    Interface.property.data = {
        set: xs.emptyFn
    };

});