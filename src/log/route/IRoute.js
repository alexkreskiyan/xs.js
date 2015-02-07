/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */
/**
 * Log route base interface. Is implemented by {@link xs.log.route.Route} and so has to be implemented by all inherited classes
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.log.route.IRoute
 *
 * @extends xs.interface.Base
 */
xs.define(xs.Interface, 'ns.IRoute', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.log.route';

    /**
     * Constructor must achieve route name as first argument, and, optionally, rules array as second argument
     *
     * @constructor
     *
     * @param {String} name
     * @param {Array} [rules]
     */
    Class.constructor = function (name, rules) {

    };

    /**
     * Core route method. Is called from {@link xs.log.Router}, when new log entry appears. Must not be called manually!
     *
     * @method process
     *
     * @param {String} category entry category string
     * @param {Number} level log entry level
     * @param {String} message log entry message
     * @param {Object} data log entry additional data
     */
    Class.method.process = function (category, level, message, data) {

    };
});