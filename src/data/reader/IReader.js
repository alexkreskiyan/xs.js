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

    Interface.method.read = function (raw) {

    };

});