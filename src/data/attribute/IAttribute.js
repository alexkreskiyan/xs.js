/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * Any attribute must implement this interface
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.attribute.IAttribute
 *
 * @extends xs.interface.Base
 */
xs.define(xs.Interface, 'ns.IAttribute', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data.attribute';

    /**
     * Attribute get method.
     * Returns given value according to internal transformation rule for scenario `internal => external`
     *
     * @method get
     *
     * @param {*} value incoming value
     * @param {Object} options value achieving options
     *
     * @return {*} transformed returned value
     */
    Interface.method.get = function (value, options) {

    };

    /**
     * Attribute set method.
     * Returns given value according to internal transformation rule for scenario `external => internal`
     *
     * @method set
     *
     * @param {*} value incoming value
     *
     * @return {*} transformed returned value
     */
    Interface.method.set = function (value) {

    };

    /**
     * Attribute constructor
     *
     * @constructor
     *
     * @param {Object} config attribute configuration object
     */
    Interface.constructor = function (config) {

    };

});