/**
 * Interface, implemented by application class
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.app.IApp
 *
 * @extends xs.interface.Base
 */
xs.define(xs.Interface, 'ns.IApp', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.app';

    Interface.method.run = function () {
    };
});