/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * Proxy base interface
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.proxy.IProxy
 *
 * @extends xs.interface.Base
 */
xs.define(xs.Interface, 'ns.IProxy', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data.proxy';

    Interface.constant.reader = {};

    Interface.constant.writer = {};

    Interface.constructor = function (config, reader, writer) {

    };

    Interface.property.reader = {
        get: xs.emptyFn
    };

    Interface.property.writer = {
        get: xs.emptyFn
    };

    Interface.method.run = function (operation) {

    };

});