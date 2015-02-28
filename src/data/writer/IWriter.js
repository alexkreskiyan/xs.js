/**
 * Data writer base interface
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @abstract
 *
 * @class xs.data.writer.IWriter
 *
 * @extends xs.interface.Base
 */
xs.define(xs.Interface, 'ns.IWriter', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.data.writer';

    Interface.constructor = function (config) {

    };

    Interface.method.write = function (data) {

    };

});