/**
 * xs.storage.Session is singleton, that provides access to browser's sessionStorage mechanism
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @singleton
 *
 * @class xs.storage.Session
 *
 * @extends xs.storage.WebStorage
 */
xs.define(xs.Class, 'ns.Session', function () {

    'use strict';

    var Class = this;

    Class.namespace = 'xs.storage';

    Class.extends = 'ns.WebStorage';

    Class.constant.storage = window.sessionStorage;

});