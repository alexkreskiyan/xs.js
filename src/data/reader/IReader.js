/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * Data reader base interface
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.reader.IReader
 *
 * @extends xs.interface.Base
 */
xs.define(xs.Interface, 'ns.IReader', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data.reader';

    Interface.constructor = function (config) {

    };

    Interface.method.read = function (raw) {

    };

});