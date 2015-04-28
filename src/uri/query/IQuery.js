/**
 * xs.uri.query.IQuery represents interface, that all query representations implement
 *
 * @author Alex Kreskiyan <a.kreskiyan@gmail.com>
 *
 * @class xs.uri.query.IQuery
 *
 * @extends xs.interface.Base
 */
xs.define(xs.Interface, 'ns.IQuery', function () {

    'use strict';

    var Interface = this;

    Interface.namespace = 'xs.uri.query';

    Interface.constructor = function (params) {

    };

    Interface.property.params = {
        get: xs.noop
    };

    Interface.method.toString = function (encode) {

    };

});