/*
 This file is core of xs.js

 Copyright (c) 2013-2014, Annium Inc

 Contact: http://annium.com/contact

 License: http://annium.com/contact

 */

/**
 * xs.storage.Local is singleton, that provides access to browser's localStorage mechanism
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @singleton
 *
 * @class xs.storage.Local
 *
 * @extends xs.storage.WebStorage
 */
xs.define(xs.Class, 'ns.Local', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.storage';

    Class.extends = 'ns.WebStorage';

    Class.constant.storage = window.localStorage;

});